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
    this.isOpen = function(tab)
    {
        for (var key in opened)
        {
            if (opened[key] == tab)
            {
                return 1;
            }
        }

        return 0;
    }

    /**
     * Checks if tab is of "CONSOLE" type
     *
     * @param {Number} tab - index of tab
     * @return {Number} - 1 if tab is of "CONSOLE" type, 0 if not
     */
    this.isConsole = function(tab)
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
                              opened[consoleTab.id] = tab;
                              console.log(opened);
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
