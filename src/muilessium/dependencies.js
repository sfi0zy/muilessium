// -----------------------------------------------------------------------------
// DEPENDENCIES
// -----------------------------------------------------------------------------


// toSlugCase
// https://github.com/ianstormtaylor/to-slug-case
// Notice: Really don't know why it's happening,
//   but es6 import of this dependency brokes the tests.
//   Use require instead.
const _toSlugCase = require('to-slug-case');

function toSlugCase(str) {
    return _toSlugCase(str);
}


// imagesLoaded
// https://imagesloaded.desandro.com/
const _imagesLoaded = require('imagesloaded');

function imagesLoaded(element, callback) {
    return _imagesLoaded(element, callback);
}


// HammerJS
// https://hammerjs.github.io/
const _Hammer = require('hammerjs');

function Hammer() {
    return _Hammer;
}


// -----------------------------------------------------------------------------


const DEPENDENCIES = {
    toSlugCase,
    imagesLoaded,
    Hammer,
};

export default DEPENDENCIES;

