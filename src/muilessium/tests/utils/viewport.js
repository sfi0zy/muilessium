require('babel-register')({
    presets: ['env']
});

require('jsdom-global/register');


const log = require('../../../../nodeunit.config.js').log;
const   _ = require('../../utils.js').default;



module.exports = {
    isInViewport(test) {
        log.warning('Can\'t test the utility.', 'Recommended to test it in the real browser.');

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
        log.warning('Can\'t test the utility.', 'Recommended to test it in the real browser.');

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

