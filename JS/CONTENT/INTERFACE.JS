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
            riseMenu: null,
            menu: null,
            tabsContainer: null,
            tabs: []
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
                    tabsContainer: "INTERFACE__TABSCONTAINER--ASIDE-PORTRAIT"
                }
            }
        }

    /**
     * Tabbed interface class
     */
    var rise;

    /**
     * State of nonstatic class elements
     */
    var state =
        {
            preset: null,
            orientation: null
        }


    /**
     * Creating HTML configurations for the interface
     */
    var presets = {};

    presets.aside =
    {
        portrait: function()
        {
            DOM.riseMenu.appendChild(DOM.menu);
            rise.showTab("MENU");

            DOM.container.classList.add(CSS.aside.portrait.container);
            DOM.menu.classList.add(CSS.aside.portrait.menu);
            DOM.tabsContainer.classList.add(CSS.aside.portrait.tabsContainer);

            state.preset = "aside";
            state.orientation = "portrait";
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
     * Creates a new static tab
     * @param  {String} name - name of creating tab
     * @return {Element}     - link to the tab workspace
     */
    this.newSection = function(name)
    {
        var index = DOM.tabs.push(rise.createTab(name)) - 1,
            tab;

        DOM.menu.newChildElement("div", {eventListeners: {click:
            (function()
            {
                rise.showTab(name);
            }).bind(this)}}, name);

        DOM.tabs[index].newChildElement("h1", {eventListeners: {click:
            (function()
            {
                rise.showTab("MENU");
            }).bind(this)}}, name);

        tab = DOM.tabs[index].newChildElement("div");

        return tab;
    }

    /**
     * Creates a new message
     * @param  {String} name - name of creating tab
     * @return {Element}     - link to the tab workspace
     */
    this.newWindow = function(name)
    {
        return rise.createTab(name);
    }


    /**
     * Creating DOM of the class
     */
    DOM.parent = properties.parent;
    DOM.container = DOM.parent.newChildElement("div");
    DOM.menu = DOM.container.newChildElement("div");
    DOM.tabsContainer = DOM.container.newChildElement("div");

    rise = new Rise(DOM.tabsContainer);
    DOM.riseMenu = rise.createTab("MENU");
}
