function init(request)
{
    if (request.type == "INIT")
    {
        if (request.tabType == "console")
        {
            new Console({parent: document.body});
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

        window.addEventListener("beforeunload",
            function(event)
            {
                chrome.runtime.sendMessage({type: "CLOSED"});
            }
        );

        chrome.runtime.sendMessage({type: "READY"});
        chrome.runtime.onMessage.removeListener(init);
    }
}

chrome.runtime.onMessage.addListener(init);
chrome.runtime.sendMessage({type: "INIT"});
