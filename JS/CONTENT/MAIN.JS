var portName;
console.log("STARTED");

chrome.runtime.onMessage.addListener((function(port, sender, sendResponse)
{
    portName = port.id;
    console.log("INITING...");

    if (port.type == "DEFAULT")
    {
        chrome.runtime.onConnect.addListener((function(port)
        {
            if (port.name == portName)
            {
                document.body.innerHTML = "SENT";
            }
        }).bind(this));
    }
    else
    {
        chrome.runtime.onConnect.addListener((function(port)
        {
            if (port.name == portName)
            {
                port.postMessage({id: 0, type: port.type});
                console.log("TAKEN");
            }
        }).bind(this));
    }

}).bind(this));
