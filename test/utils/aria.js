// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/aria.js
// -----------------------------------------------------------------------------


require('babel-register')({
    presets: ['env']
});

require('jsdom-global/register');


// const log = require('../../nodeunit.config.js').log;
const   _ = require('../../src/js/utils.js').default;


module.exports = {
    set(test) {
        document.body.innerHTML =
                `<div></div>
                 <div></div>`;

        const elements = document.querySelectorAll('div');

        // ---------------

        _.aria.set(elements[0], 'hidden');
        _.aria.set(elements[1], 'hidden', false);

        // ---------------

        test.equal(elements[0].getAttribute('aria-hidden'), 'true',  'It should set the attribute to "true" by default.');
        test.equal(elements[1].getAttribute('aria-hidden'), 'false', 'It should set the attribute to the selected value.');

        test.doesNotThrow(() => {
            _.aria.set(null);
            _.aria.set(undefined);
            _.aria.set(elements[0], null);
            _.aria.set(elements[0], null, null);
            _.aria.set(elements[0], undefined);
        });

        test.done();
    },



    setRole(test) {
        document.body.innerHTML = '<div></div>';

        const element = document.querySelector('div');

        // ---------------

        _.aria.setRole(element, 'button');

        // ---------------

        test.equal(element.getAttribute('role'), 'button', 'It should set the role of the element to the selected value.');

        test.doesNotThrow(() => {
            _.aria.setRole(null);
            _.aria.setRole(undefined);
            _.aria.setRole(element, null);
            _.aria.setRole(element, undefined);
        });

        test.done();
    },



    removeRole(test) {
        document.body.innerHTML = '<div role="button"></div>';

        const element = document.querySelector('div');

        // ---------------

        _.aria.removeRole(element);

        // ---------------

        test.equal(element.getAttribute('role'), null, 'It should remove the role from the element.');

        test.doesNotThrow(() => {
            _.aria.removeRole(null);
            _.aria.removeRole(undefined);
        });

        test.done();
    },



    setId(test) {
        document.body.innerHTML = '<div></div><div id="test"></div>';

        const elements = document.querySelectorAll('div');

        // ---------------

        _.aria.setId(elements[0], 'new-id');
        _.aria.setId(elements[1], 'new-id');

        // ---------------

        test.equal(elements[0].getAttribute('id'), 'new-id', 'It should set the id of the element to the selected value.');
        test.equal(elements[1].getAttribute('id'), 'test', 'It should not replace the existing id.');

        test.doesNotThrow(() => {
            _.aria.setId(null);
            _.aria.setId(undefined);
            _.aria.setId(elements[0], null);
            _.aria.setId(elements[0], undefined);
        });

        test.done();
    },



    get(test) {
        document.body.innerHTML = '<div aria-hidden="true"></div>';

        const element = document.querySelector('div');

        // ---------------

        const result = _.aria.get(element, 'hidden');

        // ---------------

        test.equal(result, 'true', 'It should return the value of the attribute.');

        test.doesNotThrow(() => {
            _.aria.get(null);
            _.aria.get(undefined);
            _.aria.get(element, null);
            _.aria.get(element, undefined);
        });

        test.done();
    },



    getRole(test) {
        document.body.innerHTML = '<div role="button"></div>';

        const element = document.querySelector('div');

        // ---------------

        const result = _.aria.getRole(element);

        // ---------------

        test.equal(result, 'button', 'It should return the role of the element.');
    
        test.doesNotThrow(() => {
            _.aria.getRole(null);
            _.aria.getRole(undefined);
        });

        test.done();
    },



    toggleState(test) {
        document.body.innerHTML = '<div aria-hidden="false"></div>';

        const element = document.querySelector('div');

        // ---------------

        _.aria.toggleState(element, 'hidden');

        // ---------------

        test.equal(element.getAttribute('aria-hidden'), 'true', 'It should toggle the selected state of the element.');

        test.doesNotThrow(() => {
            _.aria.toggleState(null);
            _.aria.toggleState(undefined);
            _.aria.toggleState(element, null);
            _.aria.toggleState(element, undefined);
        });

        test.done();
    }
};

