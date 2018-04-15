console.log(1);

if (window.location.href != chrome.extension.getURL("HTML/GHOST.HTML"))
{
    window.sessionStorage.URL = window.location.href;
    window.location.href = chrome.extension.getURL("HTML/GHOST.HTML");
}
else
{
    new Console({URL: window.sessionStorage.URL});
}
