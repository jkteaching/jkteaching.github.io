function injectHTML(cssSelector, htmlPath, shouldReplace){
    var injectElement = document.querySelector(cssSelector);
    if(injectElement)
        fetch(htmlPath)
            .then(response => response.text())
            .then(text => {
                if (shouldReplace) injectElement.outerHTML = text;
                else injectElement.innerHTML = text;
            });
    else
        console.log("injectHTML(): injectElement does not exist.");
}