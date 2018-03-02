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
                console.open();
                chrome.runtime.sendMessage({console: true});
            }
            else if (request.command == "CLOSE")
            {
                console.close();
                chrome.runtime.sendMessage({console: false});
            }
        }
    );

    /**
     * Placing console script to the DOM
     */
    var console = new Console();
}
