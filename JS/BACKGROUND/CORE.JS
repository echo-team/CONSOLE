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
     * @property {ClassEvent} onStateChanged - fires then console state changes
     */
    this.console =
    {
        onStateChanged: new ClassEvent()
    };

    /**
     * Founds type of the given tab by its URL and standart settings
     * @param  {String} URL - URL of tab to get type
     * @return {String}     - "console", "page" or "mixed"
     */
    function getTabType(URL)
    {
        if (URL == EXTENSION_CONSOLEPAGE)
        {
            return "console";
        }
        else if (settings.type == "separate")
        {
            return "page";
        }
        else if (settings.type == "mixed")
        {
            return "mixed";
        }
    }

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

        if (!tab || !tab.active)
        {
            return;
        }
        else if (tab.type == "mixed" && tab.console != null)
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
            var tab = tabs.findObject("id", sender.tab.id);

            if (request.type == "CONSOLE_STATE")
            {
                if (request.console)
                {
                    tab.page = sender.tab.openerTabId;
                    tabs.findObject("id", tab.page).console = tab.id;
                    this.console.onStateChanged.dispatch({console: true, from: "CORE", tab: [tab.page, tab.id]});
                }
                else
                {
                    var page = tabs.findObject("id", tab.page);

                    if (!page)
                    {
                        return;
                    }

                    page.console = null;
                    this.console.onStateChanged.dispatch({console: false, from: "CORE", tab: [tab.page]});
                }
            }
            else if (request.type == "INIT")
            {
                var tab =
                    {
                        id: sender.tab.id,
                        type: getTabType(sender.tab.url),
                        console: null,
                        page: null
                    };

                chrome.tabs.sendMessage(sender.tab.id, {type: "INIT", tabType: tab.type});
                tabs.push(tab);
            }
            else if (request.type == "READY")
            {
                tab.active = true;
                this.console.onStateChanged.dispatch({console: false, from: "CORE", tab: [tab.id]});
            }
            else if (request.type == "CLOSED")
            {
                if (tab.console != null && tab.console != tab.id)
                {
                    chrome.tabs.remove(tab.console);
                }

                tabs.splice(tabs.indexOf(tab), 1);
            }
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

    /*chrome.webNavigation.onBeforeNavigate.addListener(
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
    );*/
}
