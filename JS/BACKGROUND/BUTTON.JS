/**
 * Class of main button
 */
function Button()
{
    /**
     * Changes the main button picture
     * @param {String} type  - type of picture to set
     * @param {Number} tabId - id of the tab to update the icon
     */
    function changeIcon(type, tabId)
    {
        chrome.browserAction.setIcon({path: "../IMG/" + type + "24.PNG", tabId: tabId});
    }

    /**
     * Class event of clicking to the main button
     */
    this.onClicked = new ClassEvent();

    chrome.browserAction.onClicked.addListener(
        (function(tab)
        {
            this.onClicked.dispatch({tabId: tab.id});
        }).bind(this)
    );

    /**
     * Changes state of the button at the browser toolbar
     * @param {String} console - console status
     * @param {Array}  tabs    - ids of tab needs update the icon
     */
    this.changeState = function(console, tabs)
    {
        var state = console ? "OPENED" : "CLOSED";

        tabs.forEach(
            (function(tabId)
            {
                changeIcon(state, tabId);
            }).bind(this))
    }
}
