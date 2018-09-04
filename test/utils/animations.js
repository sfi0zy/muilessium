// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/animations.js
// -----------------------------------------------------------------------------


require('babel-register')({
    presets: ['env']
});


require('jsdom-global/register');


const log = require('../../nodeunit.config.js').log;
const   _ = require('../../src/js/utils.js').default;



module.exports = {
    typeText(test) {
        log.warning('The appearance is important.',
            'All utilities for the animations should be tested manually.');

        document.body.innerHTML = '<div></div>';

        const element = document.querySelector('div');

        test.expect(2);

        // ---------------

        function callback() {
            test.equal(element.innerHTML, 'text', 'It should print the text in the element.');
            test.done();
        }

        // ---------------

        _.typeText(element, {
            text: 'text',
            delay: 120,
            cycle: false,
            times: -1
        }, callback);

        // ---------------        

        test.doesNotThrow(() => {
            _.typeText(null);
            _.typeText(undefined);
            _.typeText(element, undefined);
        });
    },



    
    typeTexts(test) {
        document.body.innerHTML = '<div></div>';

        const element = document.querySelector('div');

        // ---------------

        _.typeTexts(element, ['text-1', 'text-2']);

        // ---------------
        
        test.doesNotThrow(() => {
            _.typeTexts(null);
            _.typeTexts(undefined);
        });

        test.done();
    },
    



    activateAnimation(test) {
        document.body.innerHTML = '<div class="other-class"></div>';

        const element = document.querySelector('div');

        // ---------------

        _.activateAnimation(element);

        // ---------------

        test.ok(element.classList.contains('-activated'),  'It should add the "-activated" class to the element.');
        test.ok(element.classList.contains('other-class'), 'It should not remove other classes from the element.');

        test.doesNotThrow(() => {
            _.activateAnimation(null);
            _.activateAnimation(undefined);
        });

        test.done();
    },



    animateElement(test) {
        document.body.innerHTML = '<div class="other-class fade-in"></div>';

        const element = document.querySelector('div');

        // ---------------

        _.animateElement(element, 'fade-out');

        // ---------------

        test.ok(element.classList.contains('-js-animation'), 'It should add the "-js-animation" class to the element.');
        test.ok(element.classList.contains('-fade-out'),     'It should add the "-<animation-name>" class to the element.');
        test.ok(element.classList.contains('-activated'),    'It should add the "-activated" class to the element.');
        test.ok(element.classList.contains('other-class'),   'It should not remove other classes from the element.');

        test.doesNotThrow(() => {
            _.animateElement(null);
            _.animateElement(undefined);
            _.animateElement(element, null);
            _.animateElement(element, undefined);
        });

        test.done(); 
    }
};

