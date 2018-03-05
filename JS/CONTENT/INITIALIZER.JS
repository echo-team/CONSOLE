/**
 * Class to initialise and control console
 */
function Initializer()
{
    chrome.runtime.onMessage.addListener(
        function (request, sender)
        {
            if (request.type == "CONSOLE_STATE")
            {
                if (request.command == "OPEN")
                {
                    console.log("OPENED");
                    chrome.runtime.sendMessage({type: "CONSOLE_STATE", console: true});
                }
                else if (request.command == "CLOSE")
                {
                    console.log("CLOSED");
                    chrome.runtime.sendMessage({type: "CONSOLE_STATE", console: false});
                }
            }
        }
    );

    /**
     * Placing console script to the DOM
     */
}
