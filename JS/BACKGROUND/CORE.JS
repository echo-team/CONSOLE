function Core()
{
    /**
     * Array of opened tabs, key is id of CONSOLE tab, content is id of DEFAULT tab
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
     * Event of new tab opening
     * @type {ClassEvent}
     */
    this.onTypeChanged = new ClassEvent();

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
     * Opens port to connect with CONSOLE tab with DEFAULT one, name of port is id of DEFAULT tab
     * @param {Object} connection  - object with connected tabs
     * @param {String} name        - name of port, CONSOLE or DEFAULT
     * @param {String} destination - name of the tab which is going to get messages, CONSOLE or DEFAULT
     * @return {Object}            - opened port
     */
    function openPort(connection, name, destination)
    {
        var port = chrome.runtime.connect({name: Number.toString(connection[destination.toLowerCase()].id)});
        port.onMessage.addListener((function(message)
        {
            console.log(message, opened);
            this.postMessage(message);
        }).bind(connection[destination.toLowerCase()].port));

        return port;
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
        consoleWasOpened = true;

        chrome.tabs.create({url: "chrome-extension://knbngjgglbmhnfhpkkngmeobabckoeho/HTML/MAIN.HTML"}, (function(consoleTab)
        {
            var index = opened.push({console: {id: consoleTab.id}, default: {id: tabId}}) - 1;
            opened[index].default.port = openPort(opened[index], "DEFAULT", "CONSOLE");
            opened[index].console.port = openPort(opened[index], "CONSOLE", "DEFAULT");

            chrome.tabs.sendMessage(opened[index].default.id, {id: Number.toString(opened[index].console.id), type: "DEFAULT"}, function(response)
            {
                //console.log(response.farewell);
            });
        }).bind(this));
    }

    /**
     * Closes console bound to given tab
     * @param {Number} consoleTabId - index of console tab
     */
    this.close = function(consoleTabId)
    {
        chrome.tabs.remove(parseInt(consoleTabId));

        for (var counter = 0; counter < opened.length; counter++)
        {
            if (opened[counter].console.id == consoleTabId)
            {
                break;
            }
        }

        opened.splice(counter, 1);
    }

    chrome.tabs.onActivated.addListener(typeChanged.bind(this));
}
