/**
 * Created by apple on 7/3/17.
 */

(function (global) {
    var Arr = {
        flatten: function (arr) {
            return arr.reduce(function (flat, toFlatten) {
                return flat.concat(Array.isArray(toFlatten) ? Arr.flatten(toFlatten) : toFlatten);
            }, []);
        }
    }

    global.Arr = Arr
})(this)