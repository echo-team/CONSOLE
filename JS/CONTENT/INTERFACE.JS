/**
 * Class which is for creating different types of interface
 * @param {Object}  properties        - settings of the class
 * @param {Element} properties.parent - where to place DOM tree of the class
 */
function Interface(properties)
{
    /**
     * DOM tree of the class
     */
    var DOM =
        {
            parent: null,
            container: null,
            menu: null,
            tabs: null
        }

    /**
     * CSS of the class
     */
    var CSS =
        {
            aside:
            {
                portrait:
                {
                    container: "INTERFACE__CONTAINER--ASIDE-PORTRAIT",
                    menu: "INTERFACE__MENU--ASIDE-PORTRAIT",
                    tabs: "INTERFACE__TABS--ASIDE-PORTRAIT",
                }
            }
        }


    /**
     * Creating HTML configurations for the interface
     */
    var presets = {};

    presets.aside =
    {
        portrait: function()
        {
            DOM.container.classList.add(CSS.aside.portrait.container);
            DOM.menu.classList.add(CSS.aside.portrait.menu);
            DOM.tabs.classList.add(CSS.aside.portrait.tabs);
        },
        album: function()
        {

        }
    }


    /**
     * HTML configuration loader
     * @type {Object}
     */
    this.load = presets;


    /**
     * Creating DOM of the class
     */
    DOM.parent = properties.parent;
    DOM.container = DOM.parent.newChildElement("div");
    DOM.menu = DOM.container.newChildElement("div");
    DOM.tabs = DOM.container.newChildElement("div");
}
