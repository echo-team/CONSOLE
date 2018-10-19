/**
 * Console class inserting to a page
 * @param {Object} properties         - settings of the class
 * @param {String} properties.URL     - URL link of the target page to monitor with console
 * @param {Object} properties.console - instance of Console class
 * @param {Object} properties.page    - instance of Page class
 */
function Separator(properties)
{
    /**
     * DOM tree of the class
     */
    var DOM =
        {
            separator: null,
            resizer: null
        }

    /**
     * CSS styles of the class
     */
    var CSS =
        {
            separator:
            {
                normal: "SEPARATOR",
                animate: "SEPARATOR--ANIMATED",
                shrinked: "SEPARATOR--SHRINKED"
            },
            orientation:
            {
                left: "SEPARATOR--LEFT",
                top: "SEPARATOR--TOP",
                right: "SEPARATOR--RIGHT",
                bottom: "SEPARATOR--BOTTOM"
            },
            varuables:
            {
                separatorWidth: "--SEPARATOR-WIDTH",
                separatorHeight: "--SEPARATOR-HEIGHT"
            }
        }

    /**
     * Instance of Console class
     * @type {Console}
     */
    var customConsole;

    /**
     * Instance of Page class
     * @type {Console}
     */
    var customPage;

    /**
     * Sets position of the console
     * @param {String} orientation - orientation of the console: top, bottom, left or right
     */
    function setConsolePosition(orientation)
    {
        if (["LEFT", "RIGHT"].indexOf(orientation) > -1)
        {
            customConsole.setOrientation("portrait");
        }
        else
        {
            customConsole.setOrientation("album");
        }

        DOM.separator.classList.add(CSS.orientation[orientation.toLowerCase()]);
    }

    /**
     * Opens console
     */
    this.openConsole = function()
    {
        DOM.separator.setCSS(CSS.separator.shrinked);
    }

    /**
     * Closes console
     */
    this.closeConsole = function()
    {
        DOM.separator.removeCSS(CSS.separator.shrinked);
    }

    /**
     * Creating DOM tree of the class
     */
    DOM.separator = document.body;
    DOM.separator.setCSS(CSS.separator.normal);

    customPage = properties.page;
    customConsole = properties.console;
    setConsolePosition("RIGHT");

    document.unquantCSS();
    DOM.separator.setCSS(CSS.separator.animate);

    /**
     * Setting messaging manager
     */
    chrome.runtime.onMessage.addListener(
        (function (request)
        {
            if (request.type == "CONSOLE_STATE")
            {
                if (request.command == "OPEN")
                {
                    chrome.runtime.sendMessage({type: "CONSOLE_STATE", console: true});
                    this.openConsole();
                }
                else if (request.command == "CLOSE")
                {
                    chrome.runtime.sendMessage({type: "CONSOLE_STATE", console: false});
                    this.closeConsole();
                }
            }
            else if (request.type == "CONSOLE_REINIT")
            {
                window.location.href = request.URL;
            }
        }).bind(this)
    );
}
