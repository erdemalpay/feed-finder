function flatten(arrs) {
    return Array.prototype.concat.apply([], arrs);
}
exports.flatten = flatten;


function existent(val) {
    return !!val;
}
exports.existent = existent;


function isFunction(val) {
    return Object.prototype.toString.call(val) == '[object Function]';
}
exports.isFunction = isFunction;


function once(fn) {
    var inv = false;

    return function () {
        if (inv) return;
        inv = true;
        fn.apply(null, arguments);
    }
}
exports.once = once;


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
exports.onlyUnique = onlyUnique;
