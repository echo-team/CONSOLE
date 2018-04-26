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
            tabs:
            {
                main: null
            }
        }

    /**
     * Tabed interface
     */
    var interface;

    /**
     * Creating DOM of the class
     */
    DOM.parent = properties.parent;

    /**
     * Creating interface and the main tab
     */
    interface = new Interface({parent: DOM.parent});
    interface.load.aside.portrait();

    interface.newSection("Архитектура", "Инструменты");
    interface.newSection("Консоль", "Инструменты");
    interface.newSection("Палитра", "Инструменты");
    interface.newSection("Настройки", "Прочее");
}
