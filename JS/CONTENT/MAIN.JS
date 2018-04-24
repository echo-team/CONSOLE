function init(request)
{
    if (request.pageTabId)
    {
        new Console({pageTabId: request.pageTabId});
    }
    else if (request.consoleTabId)
    {
        new Page({consoleTabId: request.consoleTabId});
    }
    else
    {
        var URL = window.location.href,
            attributes = document.documentElement.attributes;

        document.documentElement.innerHTML = "";

        for (var counter = 0; counter < attributes.length; counter++)
        {
            document.documentElement.removeAttribute(attributes[counter].name);
        }

        new Separator({URL: URL});
    }
}

window.stop();
chrome.runtime.onMessage.addListener(init.bind(this));
chrome.runtime.sendMessage({type: "CONSOLE_INIT"});
