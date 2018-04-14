/**
 * Initialization of global constants
 */
var EXTENSION_ID = chrome.runtime.id;

/**
 * Initialization of main classes
 */
var core = new Core(),
    button = new Button();


/**
 * Button initialization
 */

core.console.onOpened.addEventListener(
    function()
    {
        button.changeState(true);
    }
);

core.console.onClosed.addEventListener(
    function()
    {
        button.changeState(false);
    }
);

button.onClicked.addEventListener(
    function(event)
    {
        core.toggleConsole(event.tabId);
        console.log("TOGGLED: " + event.tabId);
    }
);
