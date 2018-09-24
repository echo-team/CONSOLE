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
    function(event)
    {
        button.changeState(true, event.tabs);
    }
);

core.console.onClosed.addEventListener(
    function(event)
    {
        button.changeState(false, event.tabs);
    }
);

button.onClicked.addEventListener(
    function(event)
    {
        core.toggleConsole(event.tabId);
    }
);
