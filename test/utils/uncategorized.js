// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/uncategorized.js
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
    normalizeTabIndex(test) {
        document.body.innerHTML =
                `<a        tabindex="1" href=''></a>
                 <button   tabindex="2"></button>
                 <input    tabindex="3"></input>
                 <label    tabindex="4"></label>
                 <select   tabindex="5"></select>
                 <textarea tabindex="6"></textarea>
                 <object   tabindex="7"></object>
                 <div></div>
                 <div></div>`;

        const focusableElements = document.querySelectorAll('a,button,input,label,select,textarea,object');
        const otherElements     = document.querySelectorAll('div');
 
        // ---------------

        _.normalizeTabIndex();

        // ---------------

        [].forEach.call(focusableElements, (element) => {
            test.equal(element.tabIndex, 0, 'It should set the tabindex of the focusable element to zero.');
        });

        [].forEach.call(otherElements, (element) => {
            test.equal(element.tabIndex, -1, 'It should not change the tabindex of other elements.');
        });

        test.done();
    },



    lazyLoadImages(test) {
        log.warning('imagesLoaded does not work with jsdom.',
            'The lazyLoadImages utility should be tested manually');

        const src    = 'http://via.placeholder.com/100x100';
        const srcset = 'http://via.placeholder.com/100x100 1x, http://via.placeholder.com/200x200 2x';
        const sizes  = '100%';

        document.body.innerHTML =
                `<img class='mui-image -js-lazy-load'
                     data-src='${src}'
                     data-srcset='${srcset}'
                     data-sizes='${sizes}'
                     src='...'>`;

        const image = document.querySelector('img');

        test.expect(3);

        // ---------------

        function callback() {
            // test.ok(true, 'It should execute the callback function when all images loaded.');
        }
 
        // ---------------

        _.lazyLoadImages(callback);

        // ---------------

        test.equal(image.src,    src,    'It should set the src of the image equal to the data-src.');
        test.equal(image.srcset, srcset, 'It should set the srcset of the image equal to the data-srcset.');
        test.equal(image.sizes,  sizes,  'It should set the sizes of the image equal to the data-sizes.');

        test.done();
    },



    initAnchorLinks(test) {
        log.warning('Window.scroll is not implemented in jsdom.',
            'All scroll utilities should be tested manually.');

        document.body.innerHTML =
                `<a href='#test-id'></a>
                 <div id='test-id'></div>`;

        const link = document.querySelector('a');
 
        test.expect(1);

        // ---------------

        _.initAnchorLinks();

        // ---------------

        link.click();

        setTimeout(() => {
            // JSDOM transforms the link.href from "#test-id" to the "about:blank#test-id"
            test.equal(window.location.hash.substring(1), link.href.split('#')[1],
                'It should set the window.location.hash equal to the link.href after scrolling.');

            test.done();
        }, 500);
    },



    generateRandomString(test) {
        const resultStandard = _.generateRandomString();
        const resultCustom   = _.generateRandomString(3);

        // ---------------

        test.ok(/^[a-zA-Z0-9]{8}$/.test(resultStandard), 'It should generate a random string with the length = 8 by default.');
        test.ok(/^[a-zA-Z0-9]{3}$/.test(resultCustom),   'It should generate a random string with the selected length.');

        test.doesNotThrow(() => {
            _.generateRandomString(null);
        });

        test.done();
    },



    stringify(test) {
        const objects = [
            null,
            undefined,
            [],
            {},
            [[], []],
            { a: {}, b: {} },
            () => {},
            [() => {}],
            { a: () => {} }
        ];

        const expectedResults = [
            'null',
            'undefined',
            '[]',
            '{}',
            '[[],[]]',
            '{"a":{},"b":{}}',
            '"function"',
            '["function"]',
            '{"a":"function"}'
        ];

        const results = [];

        test.expect(9);

        // ---------------

        objects.forEach((object) => {
            results.push(_.stringify(object));
        });

        // ---------------

        results.forEach((result, index) => {
            test.equal(result, expectedResults[index], `It should stringify the object #${index}.`);
        });

        test.done();
    },



    extend(test) {
        const objects = [
            { a: {} },
            { b: {} }
        ];

        const results = [];
 
        // ---------------

        results.push(_.extend(undefined, undefined));
        results.push(_.extend({}, undefined));
        results.push(_.extend(undefined, {}));
        results.push(_.extend(null, null));
        results.push(_.extend({}, null));
        results.push(_.extend(null, {}));
        results.push(_.extend(objects[0], objects[1]));

        // ---------------

        test.deepEqual(results[0], {});
        test.deepEqual(results[1], {});
        test.deepEqual(results[2], {});
        test.deepEqual(results[3], {});
        test.deepEqual(results[4], {});
        test.deepEqual(results[5], {});
        test.deepEqual(results[6], { a: {}, b : {} });


        test.done();
    },



    debounce(test) {
        test.expect(2); 

        // ---------------

        function callback() {
            test.ok(true, 'It should allow to execute the callback function only once every 100ms.');
        }

        // ---------------

        const func = _.debounce(callback, 100);

        func();
        func();

        // ---------------
        
        test.doesNotThrow(() => {
            _.debounce(undefined);
            _.debounce(null);
            _.debounce(callback, undefined);
            _.debounce(callback, null);
        });

        test.done();
    },



    stringToBoolean(test) {
        const resultPositive = _.stringToBoolean('true');
        const resultNegative = _.stringToBoolean('false')
                                || _.stringToBoolean('')
                                || _.stringToBoolean(null)
                                || _.stringToBoolean(undefined);

        // ---------------

        test.ok(resultPositive,  'It should return "true" if the argument is the word "true".');
        test.ok(!resultNegative, 'It should return "false" if the argument is not the word "true".');

        test.done();
    },




    callOnce(test) {
        test.expect(2);

        // ---------------

        function callback() {
            test.ok('It should allow to excute the callback function only once.');
        }

        // ---------------

        const func = _.callOnce(callback);

        func();
        func();

        // ---------------

        test.doesNotThrow(() => {
            _.callOnce(null);
            _.callOnce(undefined);
        });

        test.done();
    },



    firstOfList(test) {
        document.body.innerHTML =
                `<div id='first'></div>
                 <div></div>`;

        const elements = document.querySelectorAll('div');
        const results = [];
 
        // ---------------

        results[0] = _.firstOfList(elements);
        results[1] = _.firstOfList([1, 2, 3]);

        // ---------------

        test.equal(results[0].id, 'first', 'It should return the first element of the NodeList.');
        test.equal(results[1],    1,       'It should return the first element of the Array.');

        test.doesNotThrow(() => {
            _.firstOfList(null);
            _.firstOfList(undefined);
        });

        test.done();
    },



    lastOfList(test) {
        document.body.innerHTML =
                `<div></div>
                 <div id='last'></div>`;

        const elements = document.querySelectorAll('div');
        const results = [];
 
        // ---------------

        results[0] = _.lastOfList(elements);
        results[1] = _.lastOfList([1, 2, 3]);

        // ---------------

        test.equal(results[0].id, 'last', 'It should return the last element of the NodeList.');
        test.equal(results[1],    3,      'It should return the last element of the Array.');

        test.doesNotThrow(() => {
            _.lastOfList(null);
            _.lastOfList(undefined);
        });

        test.done();
    },



    forEach(test) {
        log.warning('Cannot check if the delays are correct.',
            'The forEach utility with delay should be tested manually.');

        document.body.innerHTML =
                `<div id='first'></div>
                 <div id='second'></div>`;

        const elements = document.querySelectorAll('div');
        const results = [];

        // ---------------

        function callback(element, index) {
            results.push([element.id, index]);
        }

 
        // ---------------

        _.forEach(elements, callback);

        // ---------------

        test.deepEqual(results, [['first', 0], ['second', 1]]);

        test.doesNotThrow(() => {
            _.forEach(null);
            _.forEach(undefined);
            _.forEach(elements, null);
            _.forEach(elements, undefined);
        });

        test.done();
    },


    deepGet(test) {
        const obj = {
            level1: {
                level2: 'value'
            }
        };

        let goodPathResult = null;
        let badPathResult = null;
 
        // ---------------

        goodPathResult = _.deepGet(obj, 'level1.level2');
        badPathResult  = _.deepGet(obj, 'wrong-path');

        // ---------------

        test.equal(goodPathResult, 'value');
        test.equal(badPathResult, undefined);

        test.doesNotThrow(() => {
            _.deepGet(null);
            _.deepGet(undefined);
            _.deepGet(test, null);
            _.deepGet(test, undefined);
        });

        test.done();
    },


    deepSet(test) {
        const obj = {
            level1: {
                level2: 'value'
            }
        };
 
        // ---------------

        _.deepSet(obj, 'level1.level2', 'new-value');
        _.deepSet(obj, 'another_path', 'new-value');

        // ---------------

        test.equal(obj.level1.level2, 'new-value');
        test.equal(obj.another_path,  'new-value');

        test.doesNotThrow(() => {
            _.deepSet(null);
            _.deepSet(undefined);
            _.deepSet(test, null);
            _.deepSet(test, undefined);
        });

        test.done();
    },


    toLispCase(test) {
        const strings = [
            'testTest',
            'test_test',
            'test.test'
        ];
        const results = [];

        // ---------------

        strings.forEach((str) => {
            results.push(_.toLispCase(str));
        });

        // ---------------

        test.deepEqual(results, [
            'test-test',
            'test-test',
            'test-test'
        ]);

        test.doesNotThrow(() => {
            _.toLispCase(null);
            _.toLispCase(undefined);
        });

        test.done();
    }
};

