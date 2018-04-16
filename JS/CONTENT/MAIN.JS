var URL = window.location.href;

window.stop();
document.documentElement.innerHTML = "";

new Console({URL: URL});
