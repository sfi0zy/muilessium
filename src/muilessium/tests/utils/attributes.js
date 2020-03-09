require('babel-register')({
    presets: ['env']
});

require('jsdom-global/register');


const   _ = require('../../utils.js').default;


module.exports = {
    setAttribute(test) {
        document.body.innerHTML = '<div></div>';

        const element = document.querySelector('div');

        // ---------------

        _.setAttribute(element, 'data-test', 'true');

        // ---------------

        test.equal(element.getAttribute('data-test'), 'true', 'It should set the attribute of the element to the selected value.');

        test.doesNotThrow(() => {
            _.setAttribute(null);
            _.setAttribute(undefined);
            _.setAttribute(element, null);
            _.setAttribute(element, undefined);
            _.setAttribute(element, 'data-test', null);
            _.setAttribute(element, 'data-test', undefined);
        });

        test.done();
    },



    getAttribute(test) {
        document.body.innerHTML = '<div data-test="true"></div>';

        const element = document.querySelector('div');

        // ---------------

        const result = _.getAttribute(element, 'data-test');

        // ---------------

        test.equal(result, 'true', 'It should return the value of the selected attribute of the element.');

        test.doesNotThrow(() => {
            _.getAttribute(null);
            _.getAttribute(undefined);
            _.getAttribute(element, null);
            _.getAttribute(element, undefined);
        });

        test.done();
    },



    removeAttribute(test) {
        document.body.innerHTML = '<div data-test="true"></div>';

        const element = document.querySelector('div');

        // ---------------

        _.removeAttribute(element, 'data-test');

        // ---------------

        test.equal(element.getAttribute('data-test'), null, 'It should remove the attribute from the element.');

        test.doesNotThrow(() => {
            _.removeAttribute(null);
            _.removeAttribute(undefined);
            _.removeAttribute(element, null);
            _.removeAttribute(element, undefined);
        });

        test.done();
    }
};

