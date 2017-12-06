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
                case false:

                    core.open(current);
                    break;

                case true:

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
        current = event.target.id;
        type = event.target.type;

        if (type != "CONSOLE")
        {
            consoleState = core.consoleId() == null ? false : true;
        }
        else
        {
            consoleState = false;
        }

        console.log("Type of tab - ", type);
    }

    core.onTypeChanged.addEventListener(changeState.bind(this));
    chrome.browserAction.onClicked.addListener(toggleConsole.bind(this));
}
