/**
 * Class of main button
 */
function Button()
{
    /**
     * Size of setting icon
     * @type {Number}
     */
    var iconSize;

    /**
     * Class event of clicking to the main button\
     * @type {Object}
     */
    this.onClicked = new ClassEvent();

    /**
     * Changes the main button picture
     * @param {String} type  - type of picture to set
     * @param {Number} tabId - id of the tab to update the icon
     */
    function changeIcon(type, tabId)
    {
        chrome.browserAction.setIcon({path: "../IMG/" + type + iconSize + ".PNG", tabId: tabId});
    }

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


    /**
     * Calculating the most suitable button size
     */
    var size, inch = document.createElement("div");

    inch.style.width = "1IN";
    document.body.appendChild(inch);
    size = inch.offsetWidth / 4;

    if (size > 28)
    {
        iconSize = 32;
    }
    else if (size > 18)
    {
        iconSize = 24;
    }
    else
    {
        iconSize = 16;
    }


    /**
     * Making the button clicking event treating as a Button class event
     */
    chrome.browserAction.onClicked.addListener(
        (function(tab)
        {
            this.onClicked.dispatch({tabId: tab.id});
        }).bind(this)
    );
}
