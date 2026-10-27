import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('promote', Path(__file__).with_name('promote.py'))
p = importlib.util.module_from_spec(spec)
spec.loader.exec_module(p)


def fixture():
    marker = {'schema': 1, 'repository': p.PREVIEW_REPO, 'branch': 'codex/preview', 'commit': 'a'*40,
              'runId': '123', 'runAttempt': 1, 'contentHash': 'b'*64}
    run = {'id': 123, 'head_sha': 'a'*40, 'head_branch': 'codex/preview', 'event': 'push',
           'path': p.WORKFLOW, 'status': 'completed', 'conclusion': 'success', 'run_attempt': 1,
           'repository': {'full_name': p.PREVIEW_REPO}, 'head_repository': {'full_name': p.PREVIEW_REPO}}
    jobs = {'jobs': [{'name': 'Deploy checked preview', 'conclusion': 'success'}]}
    return marker, run, jobs


class ReleaseTest(unittest.TestCase):
    def test_only_successful_exact_run_can_pass(self):
        marker, run, jobs = fixture()
        p.validate_run(marker, run, jobs)
        for field, value in [('head_sha','c'*40), ('status','in_progress'), ('conclusion','failure'),
                             ('event','pull_request'), ('head_branch','main'), ('path','other.yml'), ('run_attempt',2)]:
            changed = dict(run, **{field:value})
            with self.subTest(field=field), self.assertRaises(ValueError):
                p.validate_run(marker, changed, jobs)
        for value in ['skipped', 'failure', 'cancelled', None]:
            with self.assertRaises(ValueError):
                p.validate_run(marker, run, {'jobs':[{'name':'Deploy checked preview','conclusion':value}]})

    def test_wrong_repository_or_marker_is_rejected(self):
        marker, run, jobs = fixture()
        for field in ['repository','head_repository']:
            changed = copy.deepcopy(run)
            changed[field]['full_name'] = 'attacker/preview'
            with self.assertRaises(ValueError):
                p.validate_run(marker, changed, jobs)
        for key, value in [('schema',2),('commit','main'),('runId','1/../../foo'),('contentHash','oops')]:
            with self.assertRaises(ValueError):
                p.validate_marker(dict(marker, **{key:value}))

    def test_preview_changed_after_confirmation_is_rejected(self):
        marker, _, _ = fixture()
        with patch.object(p, 'read_json', return_value=marker), self.assertRaises(ValueError):
            p.preflight('c'*40, '123', 'request-1')

    def test_production_rewrites_only_after_exact_content_match(self):
        marker, _, _ = fixture()
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root/'site-settings.json').write_text('{}')
            (root/'asset-versions.json').write_text('{}')
            html = '<html><head><meta content="noindex,nofollow" name="robots"><script src="./js/freshness.js?v=123456789012" data-page="index.html" data-page-version="old" defer></script>\n</head><body><a href="https://ponnhide.github.io/yachielab-preview/software.html">MILK</a></body></html>'
            (root/'index.html').write_text(html)
            (root/'example.pdf').write_bytes(b'%PDF-binary\x00\xff')
            with self.assertRaises(ValueError):
                p.prepare(root, marker)
            self.assertEqual((root/'index.html').read_text(),html)
            marker['contentHash'] = p.content_hash(root)
            record = p.prepare(root, marker, 'request-1')
            result = (root/'index.html').read_text()
            self.assertIn('https://yachie-lab.org/software.html', result)
            self.assertNotIn('noindex', result)
            self.assertIn(p.ANALYTICS_ID,result)
            self.assertEqual((root/'example.pdf').read_bytes(),b'%PDF-binary\x00\xff')
            self.assertEqual((root/'CNAME').read_text(),'yachie-lab.org\n')
            version = json.loads((root/'site-version.json').read_text())['pages']['index.html']
            self.assertIn('data-page-version="'+version+'"',result)
            self.assertEqual(record['productionContentHash'],p.content_hash(root))
            self.assertEqual(record['commit'],marker['commit'])

    def test_symlink_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            (root/'link').symlink_to('/etc/passwd')
            with self.assertRaises(ValueError):
                p.content_hash(root)


if __name__ == '__main__':
    unittest.main()
