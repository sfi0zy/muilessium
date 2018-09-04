// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/classes.js
// -----------------------------------------------------------------------------


require('babel-register')({
    presets: ['env']
});


require('jsdom-global/register');


// const log = require('../../nodeunit.config.js').log;
const   _ = require('../../src/js/utils.js').default;


module.exports = {
    hasClass(test) {
        document.body.innerHTML = '<div class="test-class"></div>';

        const element = document.querySelector('div');

        // ---------------

        const resultPositive = _.hasClass(element, 'test-class');
        const resultNegative = _.hasClass(element, 'another-class');

        // ---------------

        test.ok(resultPositive,  'It should return true if the element has the class.');
        test.ok(!resultNegative, 'It should return false if the element has not the class.');

        test.doesNotThrow(() => {
            _.hasClass(null);
            _.hasClass(undefined);
            _.hasClass(element, null);
            _.hasClass(element, undefined);
        });

        test.done();
    },



    hasNotClass(test) {
        document.body.innerHTML = '<div class="test-class"></div>';

        const element = document.querySelector('div');

        // ---------------

        const resultPositive = _.hasNotClass(element, 'another-class');
        const resultNegative = _.hasNotClass(element, 'test-class');

        // ---------------

        test.ok(resultPositive,  'It should return true if the element has not the class.');
        test.ok(!resultNegative, 'It should return false if the element has the class.');

        test.doesNotThrow(() => {
            _.hasNotClass(null);
            _.hasNotClass(undefined);
            _.hasNotClass(element, null);
            _.hasNotClass(element, undefined);
        });

        test.done();
    },



    addClass(test) {
        document.body.innerHTML = '<div class="old-class"></div>';

        const element = document.querySelector('div');

        // ---------------

        _.addClass(element, 'new-class');

        // ---------------

        test.ok(element.classList.contains('new-class'), 'It should add the new class to the element.');
        test.ok(element.classList.contains('old-class'), 'It should not remove the old classes from the element.');

        test.doesNotThrow(() => {
            _.addClass(null);
            _.addClass(undefined);
            _.addClass(element, null);
            _.addClass(element, undefined);
        });

        test.done();
    },



    addClasses(test) {
        document.body.innerHTML = '<div class="old-class"></div>';

        const element = document.querySelector('div');

        // ---------------

        _.addClasses(element, 'new-class-1', 'new-class-2');

        // ---------------

        test.ok(element.classList.contains('new-class-1'), 'It should add the new classes to the element.');
        test.ok(element.classList.contains('new-class-1'), 'It should add the new classes to the element.');
        test.ok(element.classList.contains('old-class'),   'It should not remove the old classes from the element.');

        test.doesNotThrow(() => {
            _.addClasses(null);
            _.addClasses(undefined);
            _.addClasses(element, null);
            _.addClasses(element, undefined);
        });

        test.done();
    },



    removeClass(test) {
        document.body.innerHTML = '<div class="old-class other-class"></div>';

        const element = document.querySelector('div');

        // ---------------

        _.removeClass(element, 'old-class');

        // ---------------

        test.ok(!element.classList.contains('old-class'),  'It should remove the old class from the element.');
        test.ok(element.classList.contains('other-class'), 'It should not remove other classes from the element.');

        test.doesNotThrow(() => {
            _.removeClass(null);
            _.removeClass(undefined);
            _.removeClass(element, null);
            _.removeClass(element, undefined);
        });

        test.done();
    },



    removeClasses(test) {
        document.body.innerHTML = '<div class="old-class-1 old-class-2 other-class"></div>';

        const element = document.querySelector('div');

        // ---------------

        _.removeClasses(element, 'old-class-1', 'old-class-2');

        // ---------------

        test.ok(!element.classList.contains('old-class-1'), 'It should remove the old classes from the element.');
        test.ok(!element.classList.contains('old-class-2'), 'It should remove the old classes from the element.');
        test.ok(element.classList.contains('other-class'),  'It should not remove other classes from the element.');

        test.doesNotThrow(() => {
            _.removeClasses(null);
            _.removeClasses(undefined);
            _.removeClasses(element, null);
            _.removeClasses(element, undefined);
        });

        test.done();
    },



    replaceClass(test) {
        document.body.innerHTML = '<div class="old-class other-class"></div>';

        const element = document.querySelector('div');

        // ---------------

        _.replaceClass(element, 'old-class', 'new-class');

        // ---------------

        test.ok(!element.classList.contains('old-class'),  'It should remove the old class from the element.');
        test.ok(element.classList.contains('new-class'),   'It should add the new class to the element.');
        test.ok(element.classList.contains('other-class'), 'It should not remove other classes from the element.');

        test.doesNotThrow(() => {
            _.replaceClass(null);
            _.replaceClass(undefined);
            _.replaceClass(element, null);
            _.replaceClass(element, undefined);
            _.replaceClass(element, 'old-class', null);
            _.replaceClass(element, 'old-class', undefined);
        });

        test.done();
    },



    toggleClass(test) {
        document.body.innerHTML = '<div class="test-class-1 other-class"></div>';

        const element = document.querySelector('div');

        // ---------------

        _.toggleClass(element, 'test-class-1');
        _.toggleClass(element, 'test-class-2');

        // ---------------

        test.ok(!element.classList.contains('test-class-1'), 'It should remove the class from the element.');
        test.ok(element.classList.contains('test-class-2'),  'It should add the class to the element.');
        test.ok(element.classList.contains('other-class'),   'It should not remove other classes from the element.');

        test.doesNotThrow(() => {
            _.toggleClass(null);
            _.toggleClass(undefined);
            _.toggleClass(element, null);
            _.toggleClass(element, undefined);
        });

        test.done();
    },
};

