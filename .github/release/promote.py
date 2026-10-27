"""Trusted production gate. Never reads Sheets, never checks out a moving branch."""
import hashlib
import json
import os
from pathlib import Path
import re
import sys
import urllib.request

PREVIEW_REPO = 'ponnhide/yachielab-preview'
PREVIEW_URL = 'https://ponnhide.github.io/yachielab-preview/'
PRODUCTION_URL = 'https://yachie-lab.org/'
WORKFLOW = '.github/workflows/checks.yml'
ANALYTICS_ID = 'G-9N928QE4W0'  # Existing public production analytics property.


def read_json(url):
    headers = {'Accept': 'application/vnd.github+json', 'User-Agent': 'YachieLab-release', 'Cache-Control': 'no-cache'}
    if url.startswith('https://api.github.com/') and os.environ.get('GH_TOKEN'):
        headers['Authorization'] = 'Bearer ' + os.environ['GH_TOKEN']
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=60) as response:
        return json.load(response)


def validate_marker(marker):
    if (marker.get('schema') != 1 or marker.get('repository') != PREVIEW_REPO or
            marker.get('branch') != 'codex/preview' or
            not re.fullmatch(r'[a-f0-9]{40}', marker.get('commit', '')) or
            not re.fullmatch(r'[0-9]+', str(marker.get('runId', ''))) or
            not isinstance(marker.get('runAttempt'), int) or marker['runAttempt'] < 1 or
            not re.fullmatch(r'[a-f0-9]{64}', marker.get('contentHash', ''))):
        raise ValueError('Invalid or unstamped preview: update the preview first.')


def validate_run(marker, run, jobs):
    validate_marker(marker)
    expected = {'id': int(marker['runId']), 'head_sha': marker['commit'], 'head_branch': 'codex/preview',
                'event': 'push', 'status': 'completed', 'conclusion': 'success', 'path': WORKFLOW,
                'run_attempt': marker['runAttempt']}
    if any(run.get(k) != v for k, v in expected.items()):
        raise ValueError('Preview workflow has not successfully published this exact revision.')
    for key in ['repository', 'head_repository']:
        if run.get(key, {}).get('full_name') != PREVIEW_REPO:
            raise ValueError('Unexpected preview repository.')
    matching = [j for j in jobs.get('jobs', []) if j.get('name') == 'Deploy checked preview']
    if len(matching) != 1 or matching[0].get('conclusion') != 'success':
        raise ValueError('Successful preview deployment job is required.')


def preflight(commit='', run_id='', request_id=''):
    if commit and not re.fullmatch(r'[a-f0-9]{40}', commit):
        raise ValueError('Invalid commit input.')
    if run_id and not re.fullmatch(r'[0-9]+', run_id):
        raise ValueError('Invalid run input.')
    if request_id and not re.fullmatch(r'[A-Za-z0-9-]{1,80}', request_id):
        raise ValueError('Invalid request ID.')
    marker = read_json(PREVIEW_URL + 'release.json?release_check=' + str(os.environ.get('GITHUB_RUN_ID', 'local')))
    validate_marker(marker)
    if (commit and marker['commit'] != commit) or (run_id and str(marker['runId']) != run_id):
        raise ValueError('Preview changed after confirmation. Check the new preview and retry.')
    base = 'https://api.github.com/repos/' + PREVIEW_REPO + '/actions/runs/' + str(marker['runId'])
    run = read_json(base)
    jobs = read_json(base + '/attempts/' + str(marker['runAttempt']) + '/jobs?per_page=100')
    validate_run(marker, run, jobs)
    Path('verified-preview.json').write_text(json.dumps(marker), encoding='utf-8')
    if os.environ.get('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'], 'a', encoding='utf-8') as stream:
            stream.write('commit=' + marker['commit'] + '\n')
    return marker


def content_hash(folder):
    digest = hashlib.sha256()
    files = []
    for item in folder.rglob('*'):
        if item.is_symlink():
            raise ValueError('Symlinks cannot enter the production artifact.')
        if item.is_file() and item.relative_to(folder).as_posix() != 'release.json':
            files.append(item)
    for item in sorted(files, key=lambda p: p.relative_to(folder).as_posix()):
        name = item.relative_to(folder).as_posix()
        digest.update((name + '\0' + hashlib.sha256(item.read_bytes()).hexdigest() + '\n').encode())
    return digest.hexdigest()


def prepare(folder, marker, request_id=''):
    validate_marker(marker)
    if content_hash(folder) != marker['contentHash']:
        raise ValueError('Rebuilt bytes differ from the published preview. Production was not changed.')
    for name in ['cms', 'scripts', 'private', 'node_modules', '.github', 'tests', 'docs']:
        if (folder / name).exists():
            raise ValueError('Non-public files in release artifact.')
    # Only deployment configuration changes after the byte-for-byte comparison.
    # Site content, Sheet styling and generated assets stay the tested snapshot.
    for item in folder.rglob('*'):
        if not item.is_file() or item.suffix not in {'.html', '.css', '.js', '.json', '.svg', '.xml', '.txt'}:
            continue
        text = item.read_text(encoding='utf-8')
        text = re.sub(r'https?://ponnhide\.github\.io/yachielab-preview(?=[/"\s<>?#\x27]|$)', PRODUCTION_URL.rstrip('/'), text)
        text = text.replace('"/yachielab-preview/', '"/').replace("'/yachielab-preview/", "'/")
        if item.suffix == '.html':
            text = re.sub(r'<meta\b(?=[^>]*\bname=["\x27]robots["\x27])(?=[^>]*\bcontent=["\x27][^"\x27]*noindex)[^>]*>\s*', '', text, flags=re.I)
            if '<head' in text.lower():
                analytics = ('<script async src="https://www.googletagmanager.com/gtag/js?id=' + ANALYTICS_ID + '"></script>\n'
                             '<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}'
                             'gtag("js",new Date());gtag("config","' + ANALYTICS_ID + '");</script>\n')
                text = re.sub(r'</head\s*>', analytics + '</head>', text, count=1, flags=re.I)
        item.write_text(text, encoding='utf-8')
    # Page hashes must describe the production URLs/analytics, not the preview HTML.
    settings = (folder / 'site-settings.json').read_text(encoding='utf-8')
    versions = (folder / 'asset-versions.json').read_text(encoding='utf-8')
    pages = {}
    for item in sorted(folder.glob('*.html')):
        if item.name == '404.html':
            continue
        text = item.read_text(encoding='utf-8')
        loader = re.search(r'<script\b[^>]*\bsrc="\./js/freshness\.js\?v=([a-f0-9]{12})"[^>]*>\s*</script>\n?', text)
        if not loader:
            raise ValueError('Missing preview page freshness stamp: ' + item.name)
        text = text[:loader.start()] + text[loader.end():]
        sha = hashlib.sha256((text + '\0' + settings + '\0' + versions).encode()).hexdigest()
        pages[item.name] = sha
        tag = '<script src="./js/freshness.js?v=' + loader[1] + '" data-page="' + item.name + '" data-page-version="' + sha + '" defer></script>\n'
        item.write_text(re.sub(r'</head\s*>', tag + '</head>', text, count=1, flags=re.I), encoding='utf-8')
    (folder / 'site-version.json').write_text(json.dumps({'version': 1, 'pages': pages}, indent=2) + '\n', encoding='utf-8')
    (folder / 'CNAME').write_text('yachie-lab.org\n', encoding='utf-8')
    record = dict(marker, environment='production', requestId=request_id,
                  productionRunId=os.environ.get('GITHUB_RUN_ID', 'local'), productionContentHash=content_hash(folder))
    (folder / 'release.json').write_text(json.dumps(record, indent=2) + '\n', encoding='utf-8')
    return record


def main():
    if sys.argv[1] == 'verify':
        record = preflight(os.environ.get('PREVIEW_COMMIT', ''), os.environ.get('PREVIEW_RUN_ID', ''), os.environ.get('RELEASE_REQUEST_ID', ''))
    elif sys.argv[1] == 'prepare':
        record = prepare(Path(sys.argv[2]), json.loads(Path('verified-preview.json').read_text()), os.environ.get('RELEASE_REQUEST_ID', ''))
    else:
        raise ValueError('Unknown release operation.')
    print(json.dumps(record))
    if os.environ.get('GITHUB_STEP_SUMMARY'):
        with open(os.environ['GITHUB_STEP_SUMMARY'], 'a', encoding='utf-8') as stream:
            stream.write('Verified preview: `' + record['commit'] + '`\n\nPreview run: ' + str(record['runId']) + '\n\n')


if __name__ == '__main__':
    main()
