/**
 * Console class inserting to a page
 * @param {Object} properties         - settings of the class
 * @param {String} properties.URL     - URL link of the target page to monitor with console
 * @param {Object} properties.console - instance of Console class
 * @param {Object} properties.page    - instance of Page class
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
                animate: "SEPARATOR--ANIMATED",
                shrinked: "SEPARATOR--SHRINKED"
            },
            orientation:
            {
                left: "SEPARATOR--LEFT",
                top: "SEPARATOR--TOP",
                right: "SEPARATOR--RIGHT",
                bottom: "SEPARATOR--BOTTOM"
            },
            varuables:
            {
                separatorWidth: "--SEPARATOR-WIDTH",
                separatorHeight: "--SEPARATOR-HEIGHT"
            }
        }

    /**
     * Instance of Console class
     * @type {Console}
     */
    var customConsole;

    /**
     * Instance of Page class
     * @type {Console}
     */
    var customPage;

    /**
     * Sizes of custom Console instance
     * @type {Object}
     */
    var consoleSize =
        {
            width: 420,
            height: 300
        }

    /**
     * Current orientation of the console (LEFT, RIGTH, TOP or BOTTOM)
     * @type {String}
     */
    var currentOrientation = "LEFT";

    /**
     * Changes width of the custom Console instance and separator
     * @param {Number} width  - width of custom Console instance
     */
    function changeConsoleWidth(width)
    {
        consoleSize.width = consoleSize.width || width;
        DOM.separator.style.setProperty(CSS.varuables.separatorWidth, consoleSize.width + "PX");
        DOM.separator.style.setProperty(CSS.varuables.separatorHeight, "0PX");
        customConsole.setSize(consoleSize.width + "PX", "100%");
    }

    /**
     * Changes height of the custom Console instance and separator
     * @param {Number} height  - height of custom Console instance
     */
    function changeConsoleHeight(height)
    {
        consoleSize.height = consoleSize.height || height;
        DOM.separator.style.setProperty(CSS.varuables.separatorHeight, consoleSize.height + "PX");
        DOM.separator.style.setProperty(CSS.varuables.separatorWidth, "0PX");
        customConsole.setSize("100%", consoleSize.height + "PX");
    }

    /**
     * Sets position of the console
     * @param {String} orientation - orientation of the console: top, bottom, left or right
     */
    function setConsolePosition(orientation)
    {
        if (["LEFT", "RIGHT"].indexOf(orientation) > -1)
        {
            customConsole.setOrientation("portrait");
            changeConsoleWidth(consoleSize.width);
        }
        else
        {
            customConsole.setOrientation("album");
            changeConsoleHeight(consoleSize.height);
        }

        currentOrientation = orientation;
        orientation = orientation.toLowerCase();
        DOM.separator.classList.add(CSS.orientation[orientation]);
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
    setConsolePosition("RIGHT");

    document.unquantCSS();
    DOM.separator.setCSS(CSS.separator.animate);

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
