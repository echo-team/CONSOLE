function init(request)
{
    if (request.type == "INIT")
    {
        if (request.tabType == "console")
        {
            var customConsole = new Console({parent: document.body});

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
            var customPage = new Page(),
                customConsole = new Console({parent: document.body});

            new Separator({URL: URL, console: customConsole, page: customPage});
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

window.stop();
chrome.runtime.onMessage.addListener(init);
chrome.runtime.sendMessage({type: "INIT"});
