/**
 * @param {Object} properties -        settings of the current class
 * @param {Object} properties.button - class of the button in the browser toolbar
 */
function Core(properties)
{
    /**
     * Constant with URL to ghost page
     * @type {String}
     */
    var EXTENSION_GHOSTPAGE = "chrome-extension://" + EXTENSION_ID + "/HTML/GHOST.HTML";

    /**
     * Object with tabs which iframes were not loaded yet
     * @type {Object}
     */
    var initQueue = {};event

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
    this.sendOpenSignal = function(tabId)
    {
        chrome.tabs.sendMessage(tabId, {type: "CONSOLE_STATE", command: "OPEN"});
    }

    /**
     * Closes console bound to given tab
     * @param {Number} tabId - index of console tab
     */
    this.sendCloseSignal = function(tabId)
    {
        chrome.tabs.sendMessage(tabId, {type: "CONSOLE_STATE", command: "CLOSE"});
    }

    /**
     * Sends command to reload console with another new target URL
     * @param {Number} tabId - index of console tab
     * @param {String} URL   - URL of target page
     */
    this.sendReinitSignal = function(tabId, URL)
    {
        chrome.tabs.sendMessage(tabId, {type: "CONSOLE_REINIT", URL: URL});
    }

    /**
     * Toggles console
     * @param {Number} tabId - index of tab to toggle console
     */
    this.toggleConsole = function(tabId)
    {
        if (opened.indexOf(tabId) == -1)
        {
            this.sendOpenSignal(tabId);
        }
        else
        {
            this.sendCloseSignal(tabId);
        }
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

    /**
     * Communication between content scripts and background
     */
    chrome.runtime.onMessage.addListener(
        (function(request, sender)
        {
            if (request.type == "CONSOLE_STATE")
            {
                if (request.console)
                {
                    opened.push(sender.tab.id);
                    this.console.onOpened.dispatch({console: true, from: "CORE", tabId: sender.tab.id});
                }
                else
                {
                    opened.splice(opened.indexOf(sender.tab.id), 1);
                    this.console.onClosed.dispatch({console: false, from: "CORE", tabId: sender.tab.id});
                }
            }
        }).bind(this)
    );

    chrome.tabs.onActivated.addListener(
        (function(event)
        {
            if (opened.indexOf(event.tabId) > -1)
            {
                this.console.onOpened.dispatch({console: true, from: "CORE", tabId: event.tabId});
            }
            else
            {
                this.console.onClosed.dispatch({console: false, from: "CORE", tabId: event.tabId});
            }
        }).bind(this)
    );

    chrome.webRequest.onHeadersReceived.addListener(
        function(info)
        {
            var headers = info.responseHeaders;

            for (var counter = 0; counter < headers.length; counter++)
            {
                var header = headers[counter].name.toLowerCase();
                if (header == "x-frame-options" || header == "frame-options")
                {
                    headers.splice(counter, 1);
                }
            }

            //headers.push({name: "Content-Security-Policy", value: "frame-src chrome-extension://klhbjkloifopollfbhkodpjhjfjhjogb/"});

            return {responseHeaders: headers};
        },
        {
            urls: [ "*://*/*" ],
            types: [ "sub_frame" ]
        },
        ['blocking', 'responseHeaders']
    );

    chrome.webNavigation.onBeforeNavigate.addListener(
        (function(event)
        {
            if (event.parentFrameId == 0)
            {
                chrome.webNavigation.getFrame({tabId: event.tabId, frameId: 0},
                    (function(mainFrame)
                    {
                        if (mainFrame.url != event.url)
                        {
                            this.sendReinitSignal(event.tabId, event.url);
                        }
                    }).bind(this)
                );
            }
        }).bind(this)
    );
}
