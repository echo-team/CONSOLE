function Core()
{
    /**
     * Object of opened tabs
     */
    var opened = {};

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
    }
}
