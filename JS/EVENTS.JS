function ClassEvent()
{
    /**
     * Array of functions to parse when event is dispatched
     * @type {Array}
     */
    var listeners = [];
    
    /**
     * Adds event listener to the event
     * @param {Function} listener - event listener to add
     */
    this.addEventListener = function(listener)
    {
        listeners.push(listener);
    }
    
    /**
     * Removes event listener from the event
     * @param {Function} listener - event listener to remove
     */
    this.removeEventListener = function(listener)
    {
        var index = listener.indexOf(listener);
        
        if (index != -1)
        {
            listeners.splice(index, 1);
        }
    }
    
    /**
     * Dispatches event immediately, calls all functions from listeners array
     * @param {Object} event - object to pass to listener
     */
    this.dispatch = function(event)
    {
        for (var counter = 0; counter < listeners.length; counter++)
        {
            listeners[counter](event);
        }
    }
}
