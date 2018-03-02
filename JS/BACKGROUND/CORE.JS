function Core()
{
    /**
     * Array of tabs with opened console
     * @type {Array}
     */
    var opened = [];

    /**
     * Instance of the Settings class
     */
    var settings =
    {
        makeConsoleActive: 1
    }

    /**
     * Console events
     * @type {Object}
     * @property {ClassEvent} onOpened - fires then console opens
     * @property {ClassEvent} onClosed - fires then console closes
     */
    this.console =
    {
        onOpened: new ClassEvent(),
        onClosed: new ClassEvent()
    };

    /**
     * Opens a new console bound to given tab
     * @param {Number} tab - index of tab to which console will be bound
     */
    this.open = function(tabId)
    {
        chrome.tabs.sendMessage(tabId, {command: "OPEN"});
    }

    /**
     * Closes console bound to given tab
     * @param {Number} tabId - index of console tab
     */
    this.close = function(tabId)
    {
        chrome.tabs.sendMessage(tabId, {command: "CLOSE"}, function(response){});
    }

    /**
     * Getter for opened array property
     */
    Object.defineProperty(this, "opened", {get:
        (function()
        {
            return opened;
        }).bind(this)
    });

    chrome.runtime.onMessage.addListener(
        (function(request, sender)
        {
            if (request.console == false)
            {
                opened.splice(opened.indexOf(sender.tab.id), 1);
                this.console.onClosed.dispatch({console: false, from: "CORE", tabId: sender.tab.id});
            }
            else
            {
                opened.push(sender.tab.id);
                this.console.onOpened.dispatch({console: true, from: "CORE", tabId: sender.tab.id});
            }
        }).bind(this)
    );

    chrome.webRequest.onHeadersReceived.addListener(
        function(info)
        {
            var headers = info.responseHeaders;
            console.log(headers);
            for (var counter = 0; counter < headers.length; counter++)
            {
                var header = headers[counter].name.toLowerCase();
                if (header == "x-frame-options" || header == "frame-options")
                {
                    headers.splice(counter, 1);
                }
            }

            //headers.push({name: "Content-Security-Policy", value: "frame-src chrome-extension://klhbjkloifopollfbhkodpjhjfjhjogb/"});

            return {responseHeaders: headers};
        },
        {
            urls: [ "*://*/*" ],
            types: [ "sub_frame" ]
        },
        ['blocking', 'responseHeaders']
    );
}
