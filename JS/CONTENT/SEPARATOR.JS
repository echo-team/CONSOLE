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
            separator: null
        }

    /**
     * CSS styles of the class
     */
    var CSS =
        {
            separator:
            {
                normal: "SEPARATOR",
                shrinked: "SEPARATOR--SHRINKED"
            },
            orientation:
            {
                album: "SEPARATOR--ALBUM",
                portrait: "SEPARATOR--PORTRAIT"
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
            customConsole.setSize("500PX", "100%");
        }
        else
        {
            customConsole.setOrientation("album");
            customConsole.setSize("100%", "350PX");
        }

        /*position = position.toLowerCase();

        DOM.wrap.classList.add(CSS.wrap[position]);
        DOM.page.classList.add(CSS.page[position]);*/
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

    /**
     * Opens console
     */
    this.openConsole = function()
    {
        DOM.separator.setCSS(CSS.separator.shrinked);
    }

    /**
     * Closes console
     */
    this.closeConsole = function()
    {
        DOM.separator.removeCSS(CSS.separator.shrinked);
    }

    /**
     * Creating DOM tree of the class
     */
    DOM.separator = document.body;
    DOM.separator.setCSS(CSS.separator.normal);

    customConsole = properties.console;
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
