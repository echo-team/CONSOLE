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
     * Sets DOM mutation listener for reacting on page header changing
     * @param {Element} title - DOM title element
     */
    function setTitleListener(title)
    {
        document.title = title.innerHTML;

        var titleListener = new MutationObserver(
            (function(title)
            {
                document.title = title.innerHTML;
            }).bind(null, title)
        );

        titleListener.observe(title, {characterData: true, childList: true, subtree: true});
    }

    /**
     * Sets current tab name from iframe page name
     */
    function setTabName()
    {
        if (DOM.page.contentDocument.title)
        {
            setTitleListener(DOM.page.contentDocument.getElementsByTagName("title")[0]);
            return;
        }

        var titleWaiter = new MutationObserver(
            (function(mutations)
            {
                mutations.forEach(
                    (function(mutation)
                    {
                        if (!mutation.addedNodes)
                        {
                            return;
                        }

                        mutation.addedNodes.forEach(
                            (function(node)
                            {
                                if (node.tagName == "TITLE")
                                {
                                    titleWaiter.disconnect();
                                    setTitleListener(node);
                                }
                            }).bind(this)
                        );
                    }).bind(this)
                );
            }).bind(this)
        );

        titleWaiter.observe(DOM.page.contentDocument, {childList: true, subtree: true});
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

    /**
     * Setting up a title-changing listener
     */
    var iframeLoadingInterval = setInterval(
         (function()
         {
             if (DOM.page.contentWindow.location.href != "about:blank" && DOM.page.contentDocument.head)
             {
                 clearInterval(iframeLoadingInterval);
                 setTabName();
             }
         }).bind(this), 100);
}
