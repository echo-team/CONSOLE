/**
 * Bonds between console and page tabs
 * @namespace Bond
 * @prop {Number} console - id of the console tab
 * @prop {Number} page    - id of the page tab
 */

/**
 * Abstraction tracking console/page tabs connections changing
 * and passing messages between them
 * @class
 */
function Tabs()
{
    /**
     * Bonds between opened console/page tabs
     * Hash array with key = page id, value = console id
     * @type {Array[Number]}
     */
    var consoles = [];

     /**
     * Bonds between opened console/page tabs
     * Hash array with key = console id, value = page id
     * @type {Array[Number]}
     */
    var pages = [];

    /**
     * Get console - page bond by tab id in it
     * @param  {Number} id - id of tab in bond
     * @return {Bond}
     */
    this.getBond = function(id)
    {
        if (consoles[id] !== undefined)
        {
            return {page: id, console: consoles[id]};
        }
        
        return {page: pages[id], console: id};
    }

    /**
     * Set console - page bond by tab id in it
     * @param {Bond}
     */
    this.setBound = function({page, console})
    {
        pages[console] = page;
        consoles[page] = console;
    }

    /**
     * Creates a new console tab
     * @param {Number}   page     - page tab id
     * @param {String}   type     - Tabs.CONSOLE or Tabs.MIXED
     * @param {Object}   callback
     * @param {Function} callback.onOpened - function, calls after console tab created
     * @param {Function} callback.onClosed - function, calls after console tab closed
     */
    this.toggleConsole = function(page, type, {onOpened, onClosed})
    {
        let bond = this.getBond(page);

        if (type == Tabs.MIXED)
        {
            this.sendMessage(page, {type: 'TABS_TOGGLE'});
        }
        else if (bond.console === undefined)
        {
            chrome.tabs.create({}, (tab) =>
                {
                    this.setBond({page: page, console: tab.id});
                    onOpened(tab);
                });
        }
        else
        {
            chrome.tabs.remove({}, (tab) =>
                {
                    this.setBond({page: page, console: undefined});
                    onClosed(tab);
                });
        }
    }

    /**
     * Wrap for chrome.reuntime.sendMessage function
     * @param {Number} id   - id of tab where data will be sent
     * @param {Objest} data - data to send
     */
    this.sendMessage = function(id, data)
    {
        chrome.runtime.sendMessage(id, data);
    }

    /**
     * Sends params for content script in new tab
     * @param {Object} data - params
     */
    this.sendInitRequest = function(id, data)
    {
        this.sendMessage(id, {type: 'TABS_INIT', bond: this.getBond(id), ...data});
    }

    /**
     * New tab asked for init params from content
     * @event Tabs#initRequest
     * @type {Object}
     * @prop {Number} id - requested tab id
     */
    this.onInitRequest = new ClassEvent();

    /**
     * Emits after tab was closed
     * @event Tabs#closed
     * @type {Object}
     * @prop {Number} id - closed tab id
     */
    this.onClosed = new ClassEvent();

    /**
     * Listen requests from content script Tabs class instance
     * @listens chrome.runtime.onMessage
     */
    chrome.runtime.onMessage.addListener((request, sender) => {
        /**
         * Request for data from new tab
         * @fires Tabs#initRequest
         */
        if (request.type === 'TABS_INIT')
        {
            this.onInitRequest.dispatch({id: sender.tab.id});
        }
        else if (request.type === 'TABS_CLOSED')
        {
            this.onClosed.dispatch({id: sender.tab.id});
        }
    });
}

/**
 * Identify console tab
 * @type {Number}
 * @memberof Tabs
 */
Object.defineProperty(Tabs, 'CONSOLE', {value: 0});

/**
 * Identify mixed tab
 * @type {Number}
 * @memberof Tabs
 */
Object.defineProperty(Tabs, 'MIXED', {value: 1});

/**
 * Identify page tab
 * @type {Number}
 * @memberof Tabs
 */
Object.defineProperty(Tabs, 'PAGE', {value: 2});