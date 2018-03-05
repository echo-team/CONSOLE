/**
 * Class of main button
 * @param {Object}   properties      - settings of class
 * @param {Function} properties.core - core of the application
 */
function Button(properties)
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
