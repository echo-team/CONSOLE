var URL = window.location.href;

window.stop();
document.documentElement.innerHTML = "";

var attributes = document.documentElement.attributes;

for (var counter = 0; counter < attributes.length; counter++)
{
    document.documentElement.removeAttribute(attributes[counter].name);
}

new Console({URL: URL});
