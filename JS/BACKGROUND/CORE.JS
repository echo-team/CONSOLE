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

        if (tab.type == "mixed")
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
        else if (tab.type == "page" && tab.consoleTabId == undefined)
        {
            chrome.tabs.create({url: EXTENSION_CONSOLEPAGE, active: tab.activateConsole},
                function(consoleTab)
                {
                    tabs.push({id: consoleTab.id, type: "console", pageTabId: tabId});
                    tab.consoleTabId = consoleTab.id;
                }
            );
        }
        else if (tab.type == "page" && tab.consoleTabId != undefined)
        {
            chrome.tabs.remove(tab.consoleTabId);
            tab.consoleTabId = undefined;
        }
        else if (tab.type == "console")
        {
            chrome.tabs.remove(tab.id);
            tabs.findObject("id", tab.pageTabId).consoleTabId = undefined;
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
                var consoleTab = tabs.findObject("id", sender.tab.id);

                if (tabs.findObject(consoleTab.pageTabId) == undefined)
                {
                    return;
                }
                else if (request.console)
                {
                    opened.push(consoleTab.id);
                    opened.push(consoleTab.pageTabId);
                    this.console.onOpened.dispatch({console: true, from: "CORE", tabId: sender.tab.id});
                }
                else
                {
                    opened.splice(opened.indexOf(consoleTab.id), 1);
                    opened.splice(opened.indexOf(consoleTab.pageTabId), 1);
                    this.console.onClosed.dispatch({console: false, from: "CORE", tabId: consoleTab.pageTabId});
                }
            }
            else if (request.type == "CONSOLE_INIT")
            {
                var tab = tabs.findObject("id", sender.tab.id);

                if (tab && tab.type == "console")
                {
                    chrome.tabs.sendMessage(sender.tab.id, {type: "CONSOLE_INIT", tabType: "console", pageTabId: tab.pageTabId});
                }
                else if (settings.type == "separate")
                {
                    tabs.push({id: sender.tab.id, type: "page", activateConsole: settings.activateConsole});
                    chrome.tabs.sendMessage(sender.tab.id, {type: "CONSOLE_INIT", tabType: "page"});
                }
                else
                {
                    tabs.push({id: sender.tab.id, type: "mixed"});
                    chrome.tabs.sendMessage(sender.tab.id, {type: "CONSOLE_INIT", tabType: "mixed"});
                }
            }
        }).bind(this)
    );

    /**
     * Updates tabs[] with new tab (page or console)
     */
    chrome.tabs.onCreated.addListener(
        (function(tab)
        {
            var console, page;

            if (tab.url == EXTENSION_CONSOLEPAGE)
            {
                console = tab.id;
                page = tab.openerTabId;                   //FIXME - openerTabId may be not set if page tab was already closed
            }
            else
            {
                console = null;
                page = tab.id;
            }

            tabs.push(
                {
                    id: tabId,
                    console: console,
                    page: page,
                    type: settings.type
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
            var tab = tabs.findObject("id", tabId);

            if (tab.type == "page" && tab.console != null)
            {
                chrome.tabs.remove(tab.console);
            }

            tabs.splice(tabs.indexOf(tab), 1);

        }).bind(this)
    );

    /**
     * Checks if console already bound to activated tab
     * Parses suitable event
     */
    chrome.tabs.onActivated.addListener(
        (function(event)
        {
            if (tabs.findObject("id", event.tabId).console != null)
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
            var headers = info.responseHeaders,
                counter = 0;

            console.log(headers);

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
