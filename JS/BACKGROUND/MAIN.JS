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

core.console.onStateChanged.addEventListener(
    function(event)
    {
        button.changeState(event.console, event.tab);
    }
);

button.onClicked.addEventListener(
    function(event)
    {
        core.toggleConsole(event.tabId);
    }
);
