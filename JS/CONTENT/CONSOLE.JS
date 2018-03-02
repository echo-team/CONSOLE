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
        parent:
        {
            console: "CONSOLE__PARENT--CONSOLE",
            normal: "CONSOLE__PARENT"
        },
        container: "CONSOLE__CONTAINER",
        page: "CONSOLE__PAGE"
    }

    /**
     * Opens console
     */
    this.open = function()
    {
        console.log("OPENED");

        DOM.parent.classList.add(CSS.parent.console);
    }

    /**
     * Closes console
     */
    this.close = function()
    {
        console.log("CLOSED");

        DOM.parent.classList.remove(CSS.parent.console);
    }

    /**
     * Creating DOM tree of the class
     */
    document.body.innerHTML = "";

    DOM.parent = document.body;
    DOM.page = DOM.parent.newChildElement("iframe", {classList: CSS.page, src: window.location.href});
    DOM.parent.classList.add(CSS.parent.normal);
    DOM.page.classList.add(CSS.page);

    DOM.container = DOM.parent.newChildElement("div", {classList: CSS.container});
}
