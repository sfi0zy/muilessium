// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/checks.js
// -----------------------------------------------------------------------------


require('babel-register')({
    presets: ['env']
});

require('jsdom-global/register');


// const log = require('../../nodeunit.config.js').log;
const   _ = require('../../src/js/utils.js').default;


module.exports = {
    isNode(test) {
        document.body.innerHTML = '<div></div>';

        const element = document.querySelector('div');

        // ---------------

        const resultPositive  = _.isNode(element);
        const resultNegative  = _.isNode([])
                                || _.isNode(null)
                                || _.isNode(undefined);

        // ---------------

        test.ok(resultPositive,  'It should return "true" if the argument is a Node.');
        test.ok(!resultNegative, 'It should return "false" if the argument is not a Node.');

        test.done();
    },



    isInPage(test) {
        document.body.innerHTML = '<div></div>';

        const element = document.querySelector('div');

        // ---------------

        const resultPositive = _.isInPage(element);
        const resultNegative = _.isInPage(document.createElement('div'))
                               || _.isInPage([])
                               || _.isInPage(null)
                               || _.isInPage(undefined);

        // ---------------

        test.ok(resultPositive,  'It should return "true" if the element is in the page.');
        test.ok(!resultNegative, 'It should return "false" if the element is not in the page.');

        test.done();
    },



    isNotInPage(test) {
        document.body.innerHTML = '<div></div>';

        const element = document.querySelector('div');

        // ---------------

        const resultPositive = _.isNotInPage(document.createElement('div'))
                             || _.isNotInPage([])
                             || _.isNotInPage(null)
                             || _.isNotInPage(undefined);
        const resultNegative = _.isNotInPage(element);

        // ---------------

        test.ok(resultPositive,  'It should return "true" if the element is not in the page or it is invalid.');
        test.ok(!resultNegative, 'It should return "false" if the element is in the page.');

        test.done();
    },



    ifExists(test) {
        document.body.innerHTML = '<div></div>';

        const element = document.querySelector('div');

        test.expect(2);

        // ---------------

        function callbackPositive() {
            test.ok(true, 'It should execute the callback function if the element exists.');
            return 1;
        }

        function callbackNegative() {
            test.ok(false, 'It should not execute the callback function if the argument is invalid.');
        }

        // ---------------

        const result = _.ifExists(element, callbackPositive);

        _.ifExists(document.createElement('div'), callbackNegative);
        _.ifExists([],                            callbackNegative);
        _.ifExists(null,                          callbackNegative);
        _.ifExists(undefined,                     callbackNegative);

        // ---------------

        test.equal(result, 1, 'It should return the result of execution of the callback function.');

        test.done();
    },



    ifNodeList(test) {
        document.body.innerHTML =
                `<div></div>
                 <div></div>`;

        const elements = document.querySelectorAll('div');

        test.expect(2);

        // ---------------

        function callbackPositive() {
            test.ok(true, 'It should execute the callback function if the argument is a NodeList.');
            return 1;
        }

        function callbackNegative() {
            test.ok(false, 'It should not execute the callback function if the argument is invalid.');
        }

        // ---------------

        const result = _.ifNodeList(elements, callbackPositive);

        _.ifNodeList(elements[0], callbackNegative);
        _.ifNodeList([],          callbackNegative);
        _.ifNodeList(null,        callbackNegative);
        _.ifNodeList(undefined,   callbackNegative);

        // ---------------

        test.equal(result, 1, 'It should return the result of execution of the callback function.');

        test.done();
    },



    isDescendant(test) {
        document.body.innerHTML =
                `<div id='parent'>
                     <div id='child'></div>
                 </div>`;

        const parent = document.querySelector('#parent');
        const child  = document.querySelector('#child');

        // ---------------
    
        const resultPositive = _.isDescendant(parent, child);
        const resultNegative = _.isDescendant(child, parent)
                                || _.isDescendant(child, child)
                                || _.isDescendant([], [])
                                || _.isDescendant(null, null)
                                || _.isDescendant(undefined, undefined);

        // ---------------

        test.ok(resultPositive,  'It should return "true" if the second element is the descendant of the first one.');
        test.ok(!resultNegative, 'It should return false if the second element is not the descendant of the first one or the arguments are invalid.');

        test.done();
    },
};

