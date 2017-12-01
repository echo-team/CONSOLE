function Core()
{
    /**
     * Object of opened tabs
     */
    var opened = {};

    /**
     * Checks if "CONSOLE" tab is open
     *
     * @param {Number} tab - index of tab
     * @return {Number} - 1 if tab is open, 0 if not
     */
    this.isOpen(tab)
    {
        return opened.indexOf(tab) == -1 ? 0 : 1;
    }

    /**
     * Checks if tab is of "CONSOLE" type
     *
     * @param {Number} tab - index of tab
     * @return {Number} - 1 if tab is of "CONSOLE" type, 0 if not
     */
    this.isConsole(tab)
    {
        return opened[tab] == undefined ? 0 : 1;
    }

    /**
     * Opens a new console bound to given tab
     *
     * @param {Number} tab - index of tab to which console will be bound
     */
    this.open = function(tab)
    {
        chrome.tabs.create({}, (function(consoleTab)
                          {
                              opened[consoleTab] = tab;
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
}
