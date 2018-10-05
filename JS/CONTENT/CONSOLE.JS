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
            hidden: "HIDDEN"
        }

    /**
     * Tabed interface
     */
    var interface;

    /**
     * Setts interface orientation
     * @param {String} orientation - orientation to set for current preset
     */
    this.setOrientation = function(orientation)
    {
        interface[orientation]();
    }

    /**
     * Setts size of the console
     * @param {String} width - width to set
     * @param {String} height - height to set
     */
    this.setSize = function(width, height)
    {
        DOM.console.style.width = width;
        DOM.console.style.height = height;
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
