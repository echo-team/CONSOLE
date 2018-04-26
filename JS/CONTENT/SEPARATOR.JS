/**
 * Console class inserting to a page
 * @param {Object} properties     - settings of the class
 * @param {String} properties.URL - URL link of the target page to monitor with console
 */
function Separator(properties)
{
    /**
     * DOM tree of the class
     */
    var DOM =
        {
            parent: null,
            wrap: null,
            container: null,
            page: null
        }

    /**
     * CSS styles of the class
     */
    var CSS =
        {
            wrap:
            {
                console: "SEPARATOR__WRAP--CONSOLE",
                top: "SEPARATOR__WRAP--TOP",
                bottom: "SEPARATOR__WRAP--BOTTOM",
                left: "SEPARATOR__WRAP--LEFT",
                right: "SEPARATOR__WRAP--RIGHT",
                common: "SEPARATOR__WRAP"
            },
            container: "SEPARATOR__CONTAINER",
            page:
            {
                top: "SEPARATOR__PAGE--TOP",
                bottom: "SEPARATOR__PAGE--BOTTOM",
                left: "SEPARATOR__PAGE--LEFT",
                right: "SEPARATOR__PAGE--RIGHT",
                common: "SEPARATOR__PAGE"
            }
        }


    /**
     * Sets position of the console
     * @param {String} position - position of the console: top, bottom, left or right
     */
    function setConsolePosition(position)
    {
        position = position.toLowerCase();

        DOM.wrap.classList.add(CSS.wrap[position]);
        DOM.page.classList.add(CSS.page[position]);
    }

    function setTitleListener()
    {
        var title = DOM.page.contentDocument.head.querySelector("title");
        document.title = title.innerHTML;

        var titleListener = new MutationObserver(
            (function(mutations)
            {
                document.title = title.innerHTML;
                console.log(mutations);
            }).bind(this)
        );

        titleListener.observe(title, {characterData: true, childList: true, subtree: true});
        console.log(title);
    }

    /**
     * Sets current tab name from iframe page name
     */
    function setTabName()
    {

        if (!DOM.page.contentDocument.title)
        {
            var titleWaiter = new MutationObserver(
                (function(mutations)
                {
                    mutations.forEach(
                        (function(mutation)
                        {
                            if (mutation.addedNodes.tagName == "TITLE")
                            {
                                titleWaiter.disconnect();
                                setTitleListener();
                            }
                        }).bind(this)
                    );
                }).bind(this)
            );

            titleWaiter.observe(DOM.page.contentDocument.head, {childList: true, subtree: true});
        }
        else
        {
            setTitleListener();
        }
    }

    /**
     * Opens console
     */
    this.openConsole = function()
    {
        DOM.wrap.classList.add(CSS.wrap.console);
    }

    /**
     * Closes console
     */
    this.closeConsole = function()
    {
        DOM.wrap.classList.remove(CSS.wrap.console);
    }

    /**
     * Creating DOM tree of the class
     */
    DOM.parent = document.body;
    DOM.wrap = DOM.parent.newChildElement("div", {classList: CSS.wrap.common});
    DOM.container = DOM.wrap.newChildElement("div", {classList: CSS.container});
    DOM.page = DOM.wrap.newChildElement("iframe", {classList: CSS.page.common, src: properties.URL});

    var iframeLoadingInterval = setInterval(
        (function()
        {
            if (DOM.page.contentWindow.location.href != "about:blank" && DOM.page.contentDocument.head)
            {
                clearInterval(iframeLoadingInterval);
                setTabName();
            }
        }).bind(this), 100
    );

    setConsolePosition("LEFT");
    new Console({parent: DOM.container});


    /**
     * Setting messaging manager
     */
    chrome.runtime.onMessage.addListener(
        (function (request)
        {
            if (request.type == "CONSOLE_STATE")
            {
                if (request.command == "OPEN")
                {
                    chrome.runtime.sendMessage({type: "CONSOLE_STATE", console: true});
                    this.openConsole();
                }
                else if (request.command == "CLOSE")
                {
                    chrome.runtime.sendMessage({type: "CONSOLE_STATE", console: false});
                    this.closeConsole();
                }
            }
            else if (request.type == "CONSOLE_REINIT")
            {
                window.location.href = request.URL;
            }
        }).bind(this)
    );
}
