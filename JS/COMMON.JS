/**
 * Finds object by property in array
 * @param  {String}           property - property in object looking for
 * @param  {*}                value    - value of property in object looking for
 * @return {Object|undefined}          - found object
 */
Array.prototype.findObject = function(property, value)
{
    return this.find(
        (function(element)
        {
            return element[property] == value;
        }).bind(this)
    );
}

/**
 * Finds index of object by property in array
 * @param  {String} property - property in object looking for
 * @param  {*}      value    - value of property in object looking for
 * @return {Number}          - index of found object
 */
Array.prototype.indexOfObject = function(property, value)
{
    return this.findIndex(
        (function(element)
        {
            return element[property] == value;
        }).bind(this)
    );
}
