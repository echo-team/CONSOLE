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
     * Instance of Console class
     * @type {Console}
     */
    var customConsole;

    /**
     * Sets position of the console
     * @param {String} position - position of the console: top, bottom, left or right
     */
    function setConsolePosition(position)
    {
        if (["LEFT", "RIGHT"].indexOf(position) > -1)
        {
            customConsole.setOrientation("portrait");
        }
        else
        {
            customConsole.setOrientation("album");
        }

        position = position.toLowerCase();

        DOM.wrap.classList.add(CSS.wrap[position]);
        DOM.page.classList.add(CSS.page[position]);
    }

    /**
     * Sets DOM mutation listener for reacting on page header changing
     * @param {Element} title - DOM title element
     */
    function setTitleListener(title)
    {
        document.title = title.innerHTML;

        var titleListener = new MutationObserver(
            (function(title)
            {
                document.title = title.innerHTML;
            }).bind(null, title)
        );

        titleListener.observe(title, {characterData: true, childList: true, subtree: true});
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
                            if (!mutation.addedNodes)
                            {
                                return;
                            }

                            mutation.addedNodes.forEach(
                                (function(node)
                                {
                                    if (node.tagName == "TITLE")
                                    {
                                        titleWaiter.disconnect();
                                        setTitleListener(node);
                                    }
                                }).bind(this)
                            );
                        }).bind(this)
                    );
                }).bind(this)
            );

            titleWaiter.observe(DOM.page.contentDocument, {childList: true, subtree: true});
        }
        else
        {
            setTitleListener();
        }
    }

    function createPage(event)
    {
        new Page();
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
    DOM.page.setEventListeners({"startloading": [createPage.bind(this), setTabName.bind(this)]});

    customConsole = new Console({parent: DOM.container});
    setConsolePosition("LEFT");


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
