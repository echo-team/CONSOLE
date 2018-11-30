function Plugins()
{
    /**
     * DOM tree of the component
     * @type {Object}
     */
    var DOM =
        {
            container: null
        };

    /**
     * Array of plugins (scope of known extensions)
     * @type {Array}
     */
    var plugins = [];

    /**
     * Adds single plugin or array of them into scope of known extensions
     * @param {Array|Object} toAdd - plugin or array of plugins to add
     */
    this.add = function(toAdd)
    {
        if (toAdd.__proto__ == Array.prototype)
        {
            plugins = plugins.concat(toAdd);
        }
        else
        {
            plugins.push(toAdd);
        }
    }

    /**
     * Removes single plugin from scope of known extensions
     * @param {Number} toRemove - id of plugin to remove
     */
    this.remove = function(toRemove)
    {
        var index = plugins.indexOfObject("id", toRemove);

        if (index > -1)
        {
            this.disconnect(toRemove);
            plugins.splice(index, 1);
        }
    }

    /**
     * Connects plugin
     * @param {Number} id - id of plugin to connect
     */
    this.connect = function(id)
    {
        var toConnect = plugins.findObject("id", id);

        if (!toConnect)
        {
            return;
        }

        if (toConnect.background)
        {
            DOM.container.newChildElement("srcipt", {src: toConnect.background});
        }
        if (toConnect.content)
        {

        }
    }

    /**
     * Disconnects plugin
     * @param {Number} id - id of plugin to disconnect
     */
    this.connect = function(id)
    {
        var toDisconnect = plugins.findObject("id", id);

        if (!toDisconnect)
        {
            return;
        }

        if (toDisconnect.background)
        {
            DOM.container.removeChild(DOM.container.querySelector("[src=" + toDisconnect.background + "]"));
        }
        if (toDisconnect.content)
        {

        }
    }

    /**
     * Creating DOM of the component
     */
    DOM.container = document.body.newChildElement("div");
}
