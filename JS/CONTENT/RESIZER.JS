/**
 * Class of dragging panel realising drag'n'drop for element on the page
 * @param {Object}  properties           - object with settings for the class
 * @param {Element} properties.target    - element to track changes
 * @param {String}  properties.CSSWidth  - CSS variable with the width of target element
 * @param {String}  properties.CSSHeight - CSS variable with the height of target element
 * @param {Element} properties.CSSHolder - element where CSS variables defined, <html> if not given
 */
function Resizer(properties)
{
    /**
     * DOM tree of the class
     * @type {Object}
     */
    var DOM =
        {
            target: null,
            panel: null,
            CSSHolder: null
        };

    /**
     * CSS styles of the class
     * @type {Object}
     */
    var CSS =
        {
            resizer: "RESIZER",
            left: "RESIZER--LEFT",
            right: "RESIZER--RIGTH",
            top: "RESIZER--TOP",
            bottom: "RESIZER--BOTTOM",
            variables:
            {
                targetWidth: properties.CSSWidth || document.documentElement,
                targetHeight: properties.CSSHeight || document.documentElement
            }
        }

    /**
     * The current position of panel
     * @type {String} - "LEFT", "RIGHT", "TOP" or "BOTTOM"
     */
    var position = null;

    /**
     * Parces an event after pannel was dragged
     * @param {Event} event - info about "mousemove" event
     */
    var resize = function(event)
    {
        switch(position)
        {
            case ("RIGHT"):

                DOM.CSSHolder.style.setProperty(CSS.variables.targetWidth, event.pageX - DOM.target.getBoundingClientRect().left + "PX");
                break;

            case ("LEFT"):

                DOM.CSSHolder.style.setProperty(CSS.variables.targetWidth, DOM.target.getBoundingClientRect().right - event.pageX + "PX");
                break;

            case ("BOTTOM"):

                DOM.CSSHolder.style.setProperty(CSS.variables.targetHeight, event.pageY - DOM.target.getBoundingClientRect().top + "PX");
                break;

            case ("TOP"):

                DOM.CSSHolder.style.setProperty(CSS.variables.targetHeight, DOM.target.getBoundingClientRect().bottom - event.pageY + "PX");
                break;
        }
    }.bind(this);

    /**
     * Turning off ability to drag panel and change size of target element
     */
    var turnOff = function()
    {
        document.body.removeEventListener("mousemove", resize);
        document.body.removeEventListener("mouseup", turnOff);
    }.bind(this);

    /**
     * Turning on ability to drag panel and change size of target element
     */
    function turnOn()
    {
        document.body.addEventListener("mousemove", resize);
        document.body.addEventListener("mouseup", turnOff);
    }

    /**
     * Creating DOM tree
     */
    DOM.target = properties.target;
    DOM.CSSHolder = properties.CSSHolder;
    DOM.panel = DOM.target.newChildElement("div", {classList: CSS.resizer, eventListeners: {"mousedown": turnOn.bind(this)}});
}