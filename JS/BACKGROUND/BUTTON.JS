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
     * Changes state of the main button in dependace of the active tab
     * @param {activeInfo} event - information about the activated tab
     */
    function changeState(event)
    {
        if (event.console || properties.core.opened.indexOf(tab.tabId) > -1)
        {
            changeIcon("OPEN");
        }
        else
        {
            changeIcon("CLOSE");
        }
    }

    properties.core.onOpen.addEventListener(changeState.bind(this));
    properties.core.onClosed.addEventListener(changeState.bind(this));
    chrome.browserAction.onActivated.addListener(changeState.bind(this));
    chrome.browserAction.onClicked.addListener(toggleConsole.bind(this));
}
