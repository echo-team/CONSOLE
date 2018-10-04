/**
 * Class for listening page changes
 */
function Page()
{
    /**
     * DOM tree of the class
     * @type {Object}
     */
    var DOM =
        {
            page: null
        };

    /**
     * CSS styles of the class
     * @type {Object}
     */
    var CSS =
        {
            page: "PAGE"
        }

    /**
     * Removing loaded DOM and attributes of <html>
     */
    var URL = window.location.href,
        attributes = document.documentElement.attributes;

    document.documentElement.innerHTML = "";
    Array.from(attributes).forEach(
        function(attribute)
        {
            document.documentElement.removeAttribute(attribute.name);
        });

    /**
     * Creating DOM of the class
     */
    DOM.page = document.body.newChildElement("iframe", {classList: CSS.page});
    DOM.page.contentWindow.location.href = window.location.href;
}
