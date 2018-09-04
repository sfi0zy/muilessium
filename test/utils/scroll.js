// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/scroll.js
// -----------------------------------------------------------------------------


require('babel-register')({
    presets: ['env']
});


require('jsdom-global/register');


const log = require('../../nodeunit.config.js').log;
const   _ = require('../../src/js/utils.js').default;


// This will fix the following error from jsdom runtime:
// - Error: Not implemented: window.scroll
window.scroll = () => {};

// It looks like smoothscroll-polyfill doesn't work with the latest jsdom
// versions. Here is little fix for it.
// See /src/js/polyfills.js for more information about polyfills.
window.HTMLElement.prototype.scrollIntoView = () => {};


module.exports = {
    scrollTo(test) {
        log.warning('Window.scroll is not implemented in jsdom.',
            'All scroll utilities should be tested manually.');

        document.body.innerHTML = '<div></div>';

        const element = document.querySelector('div');
 
        // ---------------
 
        function callback() {
            test.ok(true, 'It should execute the callback function when scroll ends.');
            test.done();
        }

        // ---------------

        _.scrollTo(element, callback);

        // ---------------

        test.doesNotThrow(() => {
            _.scrollTo(null);
            _.scrollTo(undefined);
            _.scrollTo(element, null);
            _.scrollTo(element, undefined);
        });
    },



    scrollToTop(test) {
        document.body.innerHTML = '';

        // ---------------

        function callback() {
            test.ok(true, 'It should execute the callback function when scroll ends.');
            test.done();
        }
 
        // ---------------

        _.scrollToTop(callback);

        // ---------------

        test.doesNotThrow(() => {
            _.scrollTo(null);
            _.scrollTo(undefined);
        });
    },



    scrollFire(test) {
        document.body.innerHTML = '<div></div>';
 
        const element = document.querySelector('div');

        test.expect(2);

        // ---------------
        
        function callback() {
            test.ok(true, 'It should execute the callback function.');
        }

        // ---------------

        _.scrollFire(element, callback);

        // ---------------

        test.doesNotThrow(() => {
            _.scrollFire(null);
            _.scrollFire(undefined);
            _.scrollFire(element, null);
            _.scrollFire(element, undefined);
        });

        test.done();
    }
};

