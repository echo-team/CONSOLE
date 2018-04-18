/**
 * Console class inserting to a page
 * @param {Object} properties     - settings of the class
 * @param {String} properties.URL - URL link of the target page to monitor with console
 */
function Console(properties)
{
    /**
     * DOM tree of the class
     */
    var DOM =
        {
            parent: null,
            wrap: null,
            container: null,
            page: null,
            tabs:
            {
                main: null
            }
        }

    /**
     * CSS styles of the class
     */
    var CSS =
        {
            wrap:
            {
                console: "CONSOLE__WRAP--CONSOLE",
                top: "CONSOLE__WRAP--TOP",
                bottom: "CONSOLE__WRAP--BOTTOM",
                left: "CONSOLE__WRAP--LEFT",
                right: "CONSOLE__WRAP--RIGHT",
                common: "CONSOLE__WRAP"
            },
            container: "CONSOLE__CONTAINER",
            page:
            {
                top: "CONSOLE__PAGE--TOP",
                bottom: "CONSOLE__PAGE--BOTTOM",
                left: "CONSOLE__PAGE--LEFT",
                right: "CONSOLE__PAGE--RIGHT",
                common: "CONSOLE__PAGE"
            }
        }

    /**
     * Tabed interface
     */
    var interface;

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
    this.open = function()
    {
        console.log("OPENED");

        DOM.wrap.classList.add(CSS.wrap.console);
    }

    /**
     * Closes console
     */
    this.close = function()
    {
        console.log("CLOSED");

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


    /**
     * Creating interface and the main tab
     */
    interface = new Interface({parent: DOM.container});
    interface.load.aside.portrait();

    interface.newSection("Архитектура", "Инструменты");
    interface.newSection("Консоль", "Инструменты");
    interface.newSection("Палитра", "Инструменты");
    interface.newSection("Настройки", "Прочее");


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
                    this.open();
                }
                else if (request.command == "CLOSE")
                {
                    chrome.runtime.sendMessage({type: "CONSOLE_STATE", console: false});
                    this.close();
                }
            }
            else if (request.type == "CONSOLE_REINIT")
            {
                window.location.href = request.URL;
            }
        }).bind(this)
    );
}
