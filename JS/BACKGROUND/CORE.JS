function Core()
{
    /**
     * Non-static information properties of the class
     * @type {Object}
     * @property {Array} communicatableTabs - tabs with open communicaton link
     */
    var state =
    {
        communicatableTabs: []
    };

    /**
     * Array of tabs with opened console
     * @type {Array}
     */
    var opened = [];

    /**
     * Instance of the Settings class
     */
    var settings =
        {
            makeConsoleActive: 1
        }

    /**
     * Type of recently opened tab
     * true if the console was just opened, false if not
     * @type {String}
     */
    var consoleWasOpened = false;

    /**
     * Console events
     * @type {Object}
     * @property {ClassEvent} onOpened - fires then console opens
     * @property {ClassEvent} onClosed - fires then console closes
     */
    this.console =
    {
        onOpened: new ClassEvent(),
        onClosed: new ClassEvent()
    };

    /**
     * Event listener of the onActivated event in chrome.tabs
     */
    function typeChanged(tab)
    {
        var connection = this.getConnection(tab.tabId),
            typeOfCurrentTab = "DEFAULT";

        if (consoleWasOpened || connection && connection.console.id == tab.tabId)
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
        consoleWasOpened = false;
    }

    /**
     * Setts event communication with tab
     * @param {Object} tabId - tab to open communicate link
     */
    function openCommunicationLink(tabId)
    {
        chrome.runtime.onMessage.addListener(
            (function(request, sender)
            {
                if (sender.tab.id == tabId)
                {
                    if (request.state == false)
                    {
                        this.console.onClosed.dispatch({console: false});
                    }
                    else
                    {
                        this.console.onOpened.dispatch({console: true});
                    }
                }
            }).bind(this)
        );
    }

    /**
     * Returns the id of CONSOLE tab for this DEFAULT tab
     * @param {Number} defaultTabId - index of DEFAULT tab
     * @return {Number}             - id of the CONSOLE tab or null
     */
    this.consoleId = function(defaultTabId)
    {
        for (var counter = 0; counter < opened.length; counter++)
        {
            if (opened[counter].default.id == defaultTabId)
            {
                return opened[counter].console.id;
            }
        }

        return null;
    }

    /**
     * Returns the connection object of CONSOLE and DEFAULT tabs
     * @param {Number} tabId - index of some tab
     * @return {Object|null} - connection object or null or nothing found
     */
    this.getConnection = function(tabId)
    {
        for (var counter = 0; counter < opened.length; counter++)
        {
            if (opened[counter].default.id == tabId || opened[counter].console.id == tabId)
            {
                return opened[counter];
            }
        }

        return null;
    }

    /**
     * Opens a new console bound to given tab
     * @param {Number} tab - index of tab to which console will be bound
     */
    this.open = function(tabId)
    {
        if (state.communicatableTabs.indexOf(tabId) == -1)
        {
            openCommunicationLink(tabId);
            state.communicatableTabs.push(tabId);
        }

        chrome.tabs.sendMessage(tabId, {command: "OPEN"});
        opened.push(tabId);
    }

    /**
     * Closes console bound to given tab
     * @param {Number} tabId - index of console tab
     */
    this.close = function(tabId)
    {
        chrome.tabs.sendMessage(tabId, {command: "CLOSE"});
        opened.splice(opened.indexOf(tabId), 1);
    }

    /**
     * Getter for opened array property
     */
    Object.defineProperty(this, "opened", {get:
        (function()
        {
            return opened;
        }).bind(this)
    });

    chrome.tabs.onActivated.addListener(typeChanged.bind(this));
}
