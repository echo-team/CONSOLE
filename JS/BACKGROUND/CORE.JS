function Core()
{
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
     * Opens a new console bound to given tab
     * @param {Number} tab - index of tab to which console will be bound
     */
    this.open = function(tabId)
    {
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

    chrome.runtime.onMessage.addListener(
        (function(request, sender)
        {
            if (request.console == false)
            {
                opened.splice(opened.indexOf(sender.tab.tabId), 1);
            }
            else
            {
                opened.push(sender.tab.tabId);
            }

            this.console.onClosed.dispatch({console: request.console, from: "CORE", tabId: sender.tab.tabId});
        }).bind(this)
    );
}
