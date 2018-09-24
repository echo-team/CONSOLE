/**
 * @param {Object} properties -        settings of the current class
 * @param {Object} properties.button - class of the button in the browser toolbar
 */
function Core(properties)
{
    /**
     * Constant with URL to page where console will be opened in separate tab
     * @type {String}
     */
    var EXTENSION_CONSOLEPAGE = "chrome-extension://" + EXTENSION_ID + "/HTML/CONSOLE.HTML";

    /**
     * Array with information about opened tabs
     * @type {Array}
     */
    var tabs = [];

    /**
     * Instance of the Settings class
     * @type {Object}
     */
    var settings =
    {
        activateConsole: true,
        type: "separate"
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
        var tab = tabs.findObject("id", tabId);

        if (tab.type == "mixed" && tab.console != null)
        {
            this.sendCloseSignal(tab.id);
        }
        else if (tab.type == "mixed")
        {
            this.sendOpenSignal(tab.id);
        }
        else if (tab.type == "page" && tab.console != null)
        {
            chrome.tabs.remove(tab.console);
        }
        else if (tab.type == "page")
        {
            chrome.tabs.create({url: EXTENSION_CONSOLEPAGE, openerTabId: tab.id});
        }
        else if (tab.type == "console")
        {
            chrome.tabs.remove(tab.id);
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
                var tab = tabs.findObject("id", sender.tab.id);

                if (request.console)
                {
                    tab.console = sender.tab.id;
                    this.console.onOpened.dispatch({console: true, from: "CORE", tabs: [tab.console, tab.page]});
                }
                else
                {
                    tab.console = null;
                    this.console.onClosed.dispatch({console: false, from: "CORE", tabs: [tab.page]});
                }
            }
            else if (request.type == "CONSOLE_INIT")
            {
                var tab = tabs.findObject("id", sender.tab.id);

                if (tab && tab.type == "console")
                {
                    chrome.tabs.sendMessage(sender.tab.id, {type: "CONSOLE_INIT", tabType: "console", pageTabId: tab.page});
                }
                else if (settings.type == "separate")
                {
                    chrome.tabs.sendMessage(sender.tab.id, {type: "CONSOLE_INIT", tabType: "page"});
                }
                else
                {
                    chrome.tabs.sendMessage(sender.tab.id, {type: "CONSOLE_INIT", tabType: "mixed"});
                }
            }
        }).bind(this)
    );

    /**
     * Updates tabs[] with new tab (page or console)
     */
    chrome.tabs.onUpdated.addListener(
        (function(tabId, change, tab)
        {
            if (tabs.findObject("id", tabId))
            {
                return;
            }

            var terminal, page, type;

            if (tab.url == EXTENSION_CONSOLEPAGE)
            {
                terminal = tab.id;
                page = tab.openerTabId;                   //FIXME - openerTabId may be not set if page tab was already closed
                type = "console";
                tabs.findObject("id", page).console = tab.id;
            }
            else
            {
                terminal = null;
                page = tab.id;
                type = settings.type == "mixed" ? "mixed" : "page";
            }

            tabs.push(
                {
                    id: tab.id,
                    console: terminal,
                    page: page,
                    type: type
                });

        }).bind(this)
    );

    /**
     * Updates tabs[] with removing closed tabs
     * Removes unpaged console tabs
     */
    chrome.tabs.onRemoved.addListener(
        (function(tabId)
        {
            var tab = tabs.findObject("id", tabId),
                page = tabs.findObject("id", tab.page);

            if (tab.type == "page" && tab.console != null)
            {
                chrome.tabs.remove(tab.console);
            }
            else if (tab.type == "console" && page)
            {
                page.console = null;
            }

            tabs.splice(tabs.indexOf(tab), 1);

        }).bind(this)
    );

    chrome.webRequest.onHeadersReceived.addListener(
        function(info)
        {
            var headers = info.responseHeaders,
                counter = 0;

            while (counter < headers.length)
            {
                var header = headers[counter].name.toLowerCase();

                if (["x-frame-options", "frame-options", "content-security-policy", "x-content-type-options", "strict-transport-security", "x-xss-protection"].indexOf(header) > -1)
                {
                    headers.splice(counter, 1);
                }
                else
                {
                    counter++;
                }
            }

            return {responseHeaders: headers};
        },
        {
            urls: [ "*://*/*" ],
            types: [ "main_frame", "sub_frame" ]
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
