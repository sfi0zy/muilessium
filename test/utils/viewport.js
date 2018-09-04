// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/viewport.js
// -----------------------------------------------------------------------------


require('babel-register')({
    presets: ['env']
});

require('jsdom-global/register');


const log = require('../../nodeunit.config.js').log;
const   _ = require('../../src/js/utils.js').default;



module.exports = {
    isInViewport(test) {
        log.warning('The rendering is not implemented in jsdom.',
            'All viewport utilities should be tested manually.');

        document.body.innerHTML = '<div></div>';

        const element = document.querySelector('div');
 
        // ---------------

        const result = _.isInViewport(element);

        // ---------------

        test.ok(result, 'It should return "true" if the element is in the viewport.');

        test.doesNotThrow(() => {
            _.isInViewport(null);
            _.isInViewport(undefined);
        });

        test.done();
    },



    isAboveViewport(test) {
        document.body.innerHTML = '<div></div>';

        const element = document.querySelector('div');
 
        // ---------------

        const result = _.isInViewport(element);

        // ---------------

        test.ok(result, 'It should return "true" if the element is above the viewport.');

        test.doesNotThrow(() => {
            _.isInViewport(null);
            _.isInViewport(undefined);
        });

        test.done();
    }
};

