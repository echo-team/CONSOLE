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
        (function (request, sender)
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
        }).bind(this)
    );
}
