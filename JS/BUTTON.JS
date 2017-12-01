function Button(core)
{
    /**
    * Type of the tab: "DEFAULT" or "CONSOLE"
    * @type {String}
    */
    var type = null;

    /**
    * State of the console: 1 if opened, 0 if closed
    * @type {Number}
    */
    var consoleState = null;

    /**
    * ID of the active tab in browser
    * @type {Number}
    */
    var current = null;

    function toggleConsole()
    {
        if (type == "DEFAULT")
        {
            switch (consoleState)
            {
                case 0:

                    core.open(current);
                    break;

                case 1:

                    core.close(current);
                    break;
            }
        }
    }

    /**
     * Changes state of the main button in dependace of the active tab
     * @param {activeInfo} event - information about the activated tab
     */
    function changeState(event)
    {
        current = event.tabId;
        type = core.isConsole(current) ? "CONSOLE" : "DEFAULT";

        if (type != "CONSOLE")
        {
            consoleState = core.isOpen();
        }
        else
        {
            consoleState = null;
        }
    }

    chrome.browserAction.onClicked.addEventListener(toggleConsole.bind(this));
    chrome.tabs.onActivated.addEventListener(changeState.bind(this));
}
