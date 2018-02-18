/**
 * Class to initialise and control console
 */
function Initializer()
{
    chrome.runtime.onMessage.addListener(
        function (request, sender)
        {
            if (request.command == "OPEN")
            {
                console.log("OPENED");
                chrome.runtime.sendMessage({console: true});
            }
            else if (request.command == "CLOSE")
            {
                console.log("CLOSED");
                chrome.runtime.sendMessage({console: false});
            }
        }
    );

    /**
     * Placing console script to the DOM
     */
    new Console();
}
