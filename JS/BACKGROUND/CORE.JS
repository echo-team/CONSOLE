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
                        opened.splice(opened.indexOf(sender.tab.tabId), 1);
                        this.console.onClosed.dispatch({console: false, from: "CORE", tabId: sender.tab.tabId});
                    }
                    else
                    {
                        opened.push(sender.tab.tabId);
                        this.console.onOpened.dispatch({console: true, from: "CORE", tabId: sender.tab.tabId});
                    }
                }
            }).bind(this)
        );
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
    }

    /**
     * Closes console bound to given tab
     * @param {Number} tabId - index of console tab
     */
    this.close = function(tabId)
    {
        chrome.tabs.sendMessage(tabId, {command: "CLOSE"});
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
