// -----------------------------------------------------------------------------
// POLYFILLS
// -----------------------------------------------------------------------------


// SMOOTH SCROLL
// https://iamdustan.com/smoothscroll/
const _smoothScroll = require('smoothscroll-polyfill').polyfill;

function smoothScroll() {
    return _smoothScroll();
}


// OBJECT FIT FOR IMAGES
// https://github.com/bfred-it/object-fit-images
// There is a css class for this polyfill.
// Take a look at src/css/utils.css for more information.
// WTF: Require doesn't work with this module, but should.
import _objectFit from 'object-fit-images';

function objectFit() {
    return _objectFit();
}


// Object.assign
// https://github.com/sindresorhus/object-assign
const _objectAssign = require('object-assign');

function objectAssign(...args) {
    return _objectAssign(...args);
}


// -----------------------------------------------------------------------------


const POLYFILLS = {
    smoothScroll,
    objectFit,
    objectAssign
};

export default POLYFILLS;

