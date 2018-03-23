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
            groups: {},
            tabsContainer: null,
            tabs: []
        }

    /**
     * CSS of the class
     */
    var CSS =
        {
            header: "INTERFACE__HEADER",
            divider: "INTERFACE__DIVIDER",
            presets:
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
            },
            theme:
            {
                container: "THEME__CONTAINER",
                header: "THEME__HEADER",
                menu: "THEME__MENU",
                divider: "THEME__DIVIDER",
                section: "THEME__SECTION"
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

            DOM.container.classList.add(CSS.presets.aside.portrait.container);
            DOM.menu.classList.add(CSS.presets.aside.portrait.menu);
            DOM.tabsContainer.classList.add(CSS.presets.aside.portrait.tabsContainer);

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
     * @param  {String} name  - name of the group in menu
     * @param  {String} group - name of creating tab
     * @return {Element}      - link to the tab workspace
     */
    this.newSection = function(name, group)
    {
        var index = DOM.tabs.push(rise.createTab(name)) - 1,
            tab, groupElement;

        for (var existingGroup in DOM.groups)
        {
            if (group == existingGroup)
            {
                groupElement = DOM.groups[existingGroup];
                return;
            }
        }

        if (!groupElement)
        {
            DOM.groups[group] = DOM.menu.newChildElement("div", {classList: [CSS.theme.divider, CSS.divider]}, group);
        }

        DOM.menu.newChildElement("div", {classList: CSS.theme.section, eventListeners: {click:
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
    DOM.parent.setCSS(CSS.theme.container);
    DOM.container = DOM.parent.newChildElement("div");
    DOM.menu = DOM.container.newChildElement("div", {classList: CSS.theme.menu});
    DOM.tabsContainer = DOM.container.newChildElement("div");

    rise = new Rise(DOM.tabsContainer);
    DOM.riseMenu = rise.createTab("MENU");
    DOM.riseMenu.newChildElement("h1", {classList: [CSS.header, CSS.theme.header]}, "Главная");
}