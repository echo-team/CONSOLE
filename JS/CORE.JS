function Core()
{
    /**
     * Array of opened tabs
     * @type {Array}
     */
    var opened = {};

    /**
     * Instance of the Settings class
     */
    var settings =
        {
            makeConsoleActive: 1
        }

    /**
     * Type of recently opened tab
     * "CONSOLE" if the console was opened, "DEFAULT" if not
     * @type {String}
     */
    var typeOfCurrentTab = "DEFAULT";

    /**
     * Event of new tab opening
     * @type {ClassEvent}
     */
    this.onTypeChanged = new ClassEvent();

    /**
     * Event listener of the onActivated event in chrome.tabs
     */
    function typeChanged(tab)
    {
        console.log(opened);
        console.log(tab);
        if (opened[tab.tabId] !== undefined)
        {
            typeOfCurrentTab = "CONSOLE";
        }

        var event =
            {
                target:
                {
                    id: tab.tabId,
                    type: typeOfCurrentTab
                }
            }

        this.onTypeChanged.dispatch(event);
        typeOfCurrentTab = "DEFAULT";
    }

    /**
     * Returns the id of "CONSOLE" tab for this "DEFAULT" tab
     * @param {Number} tab - index of tab
     * @return {Number} - id of the "CONSOLE" tab or null
     */
    this.consoleId = function(tab)
    {
        for (var key in opened)
        {
            if (opened[key] !== tab)
            {
                return key;
            }
        }

        return null;
    }

    /**
     * Opens a new console bound to given tab
     *
     * @param {Number} tab - index of tab to which console will be bound
     */
    this.open = function(tab)
    {
        typeOfCurrentTab = "CONSOLE";
        chrome.tabs.create({}, (function(consoleTab)
                          {
                              opened[consoleTab.id] = tab;
                          }).bind(this));
    }

    /**
     * Closes console bound to given tab
     *
     * @param {Number} tab - index of console tab
     */
    this.close = function(tab)
    {
        chrome.tabs.remove(tab);
        opened[tab] = undefined;
    }

    chrome.tabs.onActivated.addListener(typeChanged.bind(this));
}
