/**
 * Class of main button
 */
function Button()
{
    /**
     * Changes the main button picture
     * @param {String} type - type of picture to set
     */
    function changeIcon(type)
    {
        chrome.browserAction.setIcon({path: "../IMG/" + type + ".PNG"});
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
     */
    this.changeState = function(console)
    {
        if (console)
        {
            changeIcon("OPENED");
        }
        else
        {
            changeIcon("CLOSED");
        }
    }
}
