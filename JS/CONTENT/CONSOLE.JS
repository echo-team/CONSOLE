/**
 * Console class inserting to a page
 * @param {Object} properties        - settings of the class
 * @param {String} properties.parent - URL link of the target page to monitor with console
 */
function Console(properties)
{
    /**
     * DOM tree of the class
     */
    var DOM =
        {
            parent: null,
            console: null,
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
            console: "CONSOLE",
            hidden: "HIDDEN",
            positions:
            {
                left: "CONSOLE--LEFT",
                top: "CONSOLE--TOP",
                right: "CONSOLE--RIGHT",
                bottom: "CONSOLE--BOTTOM"
            }
        }

    /**
     * Tabed interface
     * @type {Object}
     */
    var interface;

    /**
     * Panel to resize custom console
     * @type {Object}
     */
    var resizer;

    /**
     * Current position of the custom console ("LEFT", "TOP", "RIGHT" or "BOTTOM")
     * @type {String}
     */
    var currentPosition;

    /**
     * Setts position of console to calculate resizer position and init resizer if it wasn't initted
     * @param {String} position - position of the console ("LEFT", "RIGHT", "TOP" or "BOTTOM")
     */
    this.setPosition = function(position)
    {
        if (!resizer)
        {
            resizer = new Resizer({target: DOM.console, CSSWidth: "--CONSOLE-WIDTH", CSSHeight: "--CONSOLE-HEIGHT"});

            document.documentElement.style.setProperty("--CONSOLE-WIDTH", "400PX");
            document.documentElement.style.setProperty("--CONSOLE-HEIGHT", "280PX");
        }

        DOM.console.classList.remove(currentPosition);
        currentPosition = position;

        DOM.console.classList.add(CSS.positions[currentPosition.toLowerCase()]);
        resizer.setPosition(currentPosition);
    }

    /**
     * Setts interface orientation
     * @param {String} orientation - orientation to set for current preset
     */
    this.setOrientation = function(orientation)
    {
        interface[orientation]();
    }

    /**
     * Setts interface preset
     * @param {String} preset - preset to set
     */
    this.setInterface = function(preset)
    {
        interface.load(preset);
    }

    /**
     * Creating DOM of the class
     */
    DOM.parent = properties.parent;
    DOM.console = DOM.parent.newChildElement("div", {classList: CSS.console});

    /**
     * Creating interface and the main tab
     */
    interface = new Interface({parent: DOM.console});
    interface.load("aside");

    interface.newSection("Архитектура", "Инструменты");
    interface.newSection("Консоль", "Инструменты");
    interface.newSection("Палитра", "Инструменты");
    interface.newSection("Настройки", "Прочее");
}
