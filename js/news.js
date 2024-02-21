function reloadTwitter(){
  let observer = new IntersectionObserver((entries, observer) => {
        let twitter_detects = [];
        let insta_detects   = []; 
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let tw_block = entry.target.querySelector('blockquote.pre-twitter-tweet'); 
                if(tw_block !== null){
                  if(tw_block.classList.contains("twitter-tweet") === false){ 
                    tw_block.classList.add("twitter-tweet");
                    twitter_detects.push(tw_block);
                    observer.unobserve(entry.target);
                  }
                } 

                let insta_block = entry.target.querySelector('blockquote.pre-instagram-media'); 
                if(insta_block !== null){ 
                  if(insta_block.classList.contains("instagram-media") === false){ 
                    insta_block.classList.remove("pre-instagram-media");
                    insta_block.classList.add("instagram-media");
                    insta_detects.push(insta_block);
                    observer.unobserve(entry.target);
                  }
                }
            }
        });
        console.log(insta_detects); 
        if(twitter_detects.length > 0){
          let script = document.body.querySelector('script.twitter');
          if(script !== null){
            script.remove();
            let newScript   =  document.createElement('script');
            newScript.classList.add("twitter");
            newScript.src   = "https://platform.twitter.com/widgets.js";
            newScript.async = true; 
            document.body.appendChild(newScript);
          } else {
            let newScript   =  document.createElement('script');
            newScript.classList.add("twitter"); 
            newScript.src   = "https://platform.twitter.com/widgets.js";
            newScript.async = true; 
            document.body.appendChild(newScript);
          }
        }
        
        if(insta_detects.length > 0){
          let script = document.body.querySelector('script.insta');
          if(script !== null){
            script.remove();
            let newScript   =  document.createElement('script');
            newScript.classList.add("insta");
            newScript.src   = "https://www.instagram.com/embed.js";
            document.body.appendChild(newScript);
          } else {
            let newScript   =  document.createElement('script');
            newScript.classList.add("insta"); 
            newScript.src   = "https://www.instagram.com/embed.js";
            document.body.appendChild(newScript);
            console.log("hoge", newScript.src)
          }
        }
    
    }, {
        rootMargin: '0px',
        threshold: 0.1 
    });
    
    document.querySelectorAll('.sns-post').forEach(entity => {
        observer.observe(entity);
    });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener('load',  function(){
    reloadTwitter();
    //loadTwitterWidgetsScript(loadTwitterWidgets); 
});

