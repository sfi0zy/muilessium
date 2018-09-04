// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/focus-and-click.js
// -----------------------------------------------------------------------------


require('babel-register')({
    presets: ['env']
});

require('jsdom-global/register');


// const log = require('../../nodeunit.config.js').log;
const   _ = require('../../src/js/utils.js').default;


module.exports = {
    makeElementFocusable(test) {
        document.body.innerHTML = '<div></div>';

        const element = document.querySelector('div');

        // ---------------

        _.makeElementFocusable(element);

        // ---------------

        test.equal(element.tabIndex, 0, 'It should set the tabIndex attribute to zero.');

        test.doesNotThrow(() => {
            _.makeElementFocusable(null);
            _.makeElementFocusable(undefined);
        });

        test.done();
    },



    makeElementsFocusable(test) {
        document.body.innerHTML =
                `<div></div>
                 <div></div>`;

        const elements = document.querySelectorAll('div');

        // ---------------

        _.makeElementsFocusable(elements);

        // ---------------

        [].forEach.call(elements, (element) => {
            test.equal(element.tabIndex, 0, 'It should set the tabIndex attribute of all selected elements to zero.');
        });

        test.doesNotThrow(() => {
            _.makeElementsFocusable(null);
            _.makeElementsFocusable(undefined);
        });

        test.done();
    },



    makeElementNotFocusable(test) {
        document.body.innerHTML = '<div tabindex="0"></div>';

        const element = document.querySelector('div');

        // ---------------

        _.makeElementNotFocusable(element);

        // ---------------

        test.equal(element.tabIndex, -1, 'It should set the tabIndex attribute to -1.');

        test.doesNotThrow(() => {
            _.makeElementNotFocusable(null);
            _.makeElementNotFocusable(undefined);
        });

        test.done();
    },



    makeElementsNotFocusable(test) {
        document.body.innerHTML =
                `<div tabindex='0'></div>
                 <div tabindex='1'></div>`;

        const elements = document.querySelectorAll('div');

        // ---------------

        _.makeElementsNotFocusable(elements);

        // ---------------

        [].forEach.call(elements, (element) => {
            test.equal(element.tabIndex, -1, 'It should set the tabIndex attribute of all selected elements to -1.');
        });

        test.doesNotThrow(() => {
            _.makeElementsNotFocusable(null);
            _.makeElementsNotFocusable(undefined);
        });

        test.done();
    },



    getFocusableChilds(test) {
        document.body.innerHTML =
                `<div id='parent'>
                    <div tabindex='0'></div>
                    <div tabindex='1'></div>
                    <div></div>
                 </div>`;

        const parent = document.querySelector('#parent');

        // ---------------

        const childs = _.getFocusableChilds(parent);

        // ---------------

        test.equal(childs.length, 2);

        [].forEach.call(childs, (element) => {
            test.ok(element.tabIndex >= 0, 'It should return the array of focusable elements.');
        });

        test.doesNotThrow(() => {
            _.getFocusableChilds(null);
            _.getFocusableChilds(undefined);
        });

        test.done();
    },



    getAllFocusableElements(test) {
        document.body.innerHTML =
                `<div>
                     <div tabindex='0'></div>
                     <div tabindex='1'></div>
                     <div></div>
                 </div>`;

        // ---------------

        const elements = _.getAllFocusableElements();

        // ---------------

        test.equal(elements.length, 2);

        [].forEach.call(elements, (element) => {
            test.ok(element.tabIndex >= 0, 'It should return the array of focusable elements.');
        });

        test.done();
    },



    getNextFocusableElement(test) {
        document.body.innerHTML =
                `<div>
                     <div id='prev' tabindex='0'></div>
                     <div id='next' tabindex='1'></div>
                     <div></div>
                 </div>`;

        const element = document.querySelector('#prev');

        // ---------------

        const next1 = _.getNextFocusableElement(element);
        const next2 = _.getNextFocusableElement(next1);

        // ---------------

        test.equal(next1.id, 'next', 'It should return the next focusable element.');
        test.equal(next2,    null,   'It should return "null" if the selected element is the last focusable element.');

        test.doesNotThrow(() => {
            _.getNextFocusableElement(null);
            _.getNextFocusableElement(undefined);
        });

        test.done();
    },



    getPreviousFocusableElement(test) {
        document.body.innerHTML =
                `<div>
                     <div id='prev' tabindex='0'></div>
                     <div id='next' tabindex='1'></div>
                     <div></div>
                 </div>`;

        const element = document.querySelector('#next');

        // ---------------

        const prev1 = _.getPreviousFocusableElement(element);
        const prev2 = _.getPreviousFocusableElement(prev1);

        // ---------------

        test.equal(prev1.id, 'prev', 'It should return the previous focusable element.');
        test.equal(prev2,    null,   'It should return "null" if the selected element is the first focusable element.');

        test.doesNotThrow(() => {
            _.getPreviousFocusableElement(null);
            _.getPreviousFocusableElement(undefined);
        });

        test.done();
    },



    goToNextFocusableElement(test) {
        document.body.innerHTML =
                `<div>
                     <div id='prev' tabindex='0'></div>
                     <div id='next' tabindex='1'></div>
                     <div></div>
                 </div>`;

        const element = document.querySelector('#prev');
        
        element.focus();

        // ---------------

        _.goToNextFocusableElement(element);

        // ---------------

        test.equal(document.activeElement.id, 'next', 'It should move the focus to the next focusable element.');

        test.doesNotThrow(() => {
            _.goToNextFocusableElement(element);
            _.goToNextFocusableElement(null);
            _.goToNextFocusableElement(undefined);
        });

        test.done();
    },



    goToPreviousFocusableElement(test) {
        document.body.innerHTML =
                `<div>
                     <div id='prev' tabindex='1'></div>
                     <div id='next' tabindex='1'></div>
                     <div></div>
                 </div>`;

        const element = document.querySelector('#next');
        
        element.focus();

        // ---------------

        _.goToPreviousFocusableElement(element);

        // ---------------

        test.equal(document.activeElement.id, 'prev', 'It should move the focus to the previous focusable element.');

        test.doesNotThrow(() => {
            _.goToPreviousFocusableElement(element);
            _.goToPreviousFocusableElement(null);
            _.goToPreviousFocusableElement(undefined);
        });

        test.done();
    },



    makeElementClickable(test) {
        document.body.innerHTML =
                `<div></div>
                 <div></div>
                 <div></div>`;

        const elements = document.querySelectorAll('div');
        let   isClicked = false;
        const expectedResultsForMouse    = [true, true, false];
        const expectedResultsForKeyboard = [true, false, true];

        test.expect(11);

        // ---------------

        function callback() {
            test.ok(true, 'It should execute the callback function on the "click" event for the element.');
            isClicked = true;
        }

        // ---------------

        _.makeElementClickable(elements[0], callback);
        _.makeElementClickable(elements[1], callback, { mouse: true,  keyboard: false });
        _.makeElementClickable(elements[2], callback, { mouse: false, keyboard: true  });

        // ---------------

        [0, 1, 2].forEach((i) => {
            isClicked = false;

            elements[i].click();

            test.equal(isClicked, expectedResultsForMouse[i],
                'It should execute the callback function on the "mouse click" event.');
        });

        [0, 1, 2].forEach((i) => {
            isClicked = false;

            elements[i].dispatchEvent(
                new KeyboardEvent('keydown', {
                    keyCode: 13,
                    which:   13
                })
            );

            test.equal(isClicked, expectedResultsForKeyboard[i],
                'It should execute the callback function on the "enter pressed" event.');
        });

        test.doesNotThrow(() => {
            _.makeElementClickable(null);
            _.makeElementClickable(undefined);
            _.makeElementClickable(elements[0], null);
            _.makeElementClickable(elements[0], undefined);
        });

        test.done();
    },



    makeChildElementsClickable(test) {
        document.body.innerHTML =
                `<div class='parent'>
                     <div></div>
                     <div></div>
                 </div> 
                 <div class='parent'>
                     <div></div>
                     <div></div>
                 </div>
                 <div class='parent'>
                     <div></div>
                     <div></div>
                 </div>`;

        const parents = document.querySelectorAll('.parent');
        const elements = [
            parents[0].querySelectorAll('div'),
            parents[1].querySelectorAll('div'),
            parents[2].querySelectorAll('div')
        ];
        let   isClicked = false;
        const expectedResultsForMouse    = [true, true, false];
        const expectedResultsForKeyboard = [true, false, true];

        test.expect(29);

        // ---------------

        function callback() {
            let counter = 0;

            return (index) => {
                test.ok(true, 'It should set the event listener for the click event for the element.');
                test.equal(index, (counter++) % 2, 'It should pass the index of the child element to the callback function.'); 
                isClicked = true;
            };
        }

        // ---------------

        _.makeChildElementsClickable(parents[0], elements[0], callback());
        _.makeChildElementsClickable(parents[1], elements[1], callback(),
            { mouse: true,  keyboard: false });
        _.makeChildElementsClickable(parents[2], elements[2], callback(),
            { mouse: false, keyboard: true  });

        // ---------------


        [0, 1, 2].forEach((testNumber) => {
            const expectedResult = expectedResultsForMouse[testNumber];

            [0, 1].forEach((i) => {
                isClicked = false;

                elements[testNumber][i].click();

                test.equal(isClicked, expectedResult,
                    'It should execute the callback function on the "mouse click" event.');
            });
        });

        [0, 1, 2].forEach((testNumber) => {
            const expectedResult = expectedResultsForKeyboard[testNumber];

            [0, 1].forEach((i) => {
                isClicked = false;

                elements[testNumber][i].dispatchEvent(
                    new KeyboardEvent('keydown', {
                        keyCode: 13,
                        which:   13
                    })
                );

                test.equal(isClicked, expectedResult,
                    'It should execute the callback function on the "enter pressed" event.');
            });
        });

        test.doesNotThrow(() => {
            _.makeChildElementsClickable(null);
            _.makeChildElementsClickable(undefined);
            _.makeChildElementsClickable(parents, null);
            _.makeChildElementsClickable(parents, undefined);
            _.makeChildElementsClickable(parents, elements, null);
            _.makeChildElementsClickable(parents, elements, undefined);
        });

        test.done();
    },



    onFocus(test) {
        document.body.innerHTML = '<div tabindex="0"></div>';

        const element = document.querySelector('div');

        test.expect(2);

        // ---------------
        
        function callback() {
            test.ok(true, 'It should execute the callback function on the "focus" event.');
        }

        // ---------------

        _.onFocus(element, callback);

        // ---------------

        element.focus();

        test.doesNotThrow(() => {
            _.onFocus(null);
            _.onFocus(undefined);
            _.onFocus(element, null);
            _.onFocus(element, undefined);
        });

        test.done();
    },



    onBlur(test) {
        document.body.innerHTML = '<div tabindex="0"></div>';

        const element = document.querySelector('div');

        test.expect(2);

        // ---------------

        function callback() {
            test.ok(true, 'It should execute the callback function on the "blur" event.');
        }

        // ---------------

        _.onBlur(element, callback);

        // ---------------

        element.focus();
        element.blur();

        test.doesNotThrow(() => {
            _.onBlur(null);
            _.onBlur(undefined);
            _.onBlur(element, null);
            _.onBlur(element, undefined);
        });

        test.done();
    }
};

