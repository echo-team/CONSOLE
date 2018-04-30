function init(request)
{
    if (request.type == "CONSOLE_INIT")
    {
        if (request.tabType == "console")
        {
            new Console({pageTabId: request.pageTabId, parent: document.body});
            chrome.runtime.sendMessage({type: "CONSOLE_STATE", console: true});

            window.addEventListener("beforeunload",
                function(event)
                {
                    chrome.runtime.sendMessage({type: "CONSOLE_STATE", console: false});
                }
            );
        }
        else if (request.tabType == "page")
        {
            new Page();
        }
        else if (request.tabType == "mixed")
        {
            var URL = window.location.href,
                attributes = document.documentElement.attributes;

            window.stop();
            document.documentElement.innerHTML = "";

            for (var counter = 0; counter < attributes.length; counter++)
            {
                document.documentElement.removeAttribute(attributes[counter].name);
            }

            new Separator({URL: URL});
        }

        chrome.runtime.onMessage.removeListener(init.bind(this));
    }
}

chrome.runtime.onMessage.addListener(init.bind(this));
chrome.runtime.sendMessage({type: "CONSOLE_INIT"});
