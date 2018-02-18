/**
 * Console class inserting to a page
 */
function Console()
{
    /**
     * DOM tree of the class
     */
    var DOM =
    {
        parent: null,
        container: null,
        page: null
    }

    /**
     * CSS styles of the class
     */
    var CSS =
    {
        container: "CONSOLE__CONTAINER",
        page: "CONSOLE__PAGE"
    }

    /**
     * Opens console
     */
    this.open = function()
    {
        console.log("OPENED");
    }

    /**
     * Closes console
     */
    this.close = function()
    {
        console.log("CLOSED");
    }

    /**
     * Creating DOM tree of the class
     */
    DOM.parent = document.body;
    DOM.parent.innerHTML = "";
    DOM.page = DOM.parent.newChildElement("iframe", {classList: CSS.page, "SRC": window.location.href});
}
