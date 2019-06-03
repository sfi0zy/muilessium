// -----------------------------------------------------------------------------
// CAROUSEL COMPONENT
// -----------------------------------------------------------------------------
//
// Methods list:
//  - (default) initAria()
//  - (default) initControls()
//  - (default) restoreState()
//  - startRotation()
//  - stopRotation()
//  - makeSlideActive(index)
//  - makeSlideInactive(index)
//  - rotateNext()
//  - rotatePrev()
//  - rotate(index)
//
// -----------------------------------------------------------------------------


import Component from '../component';

import MOUSE       from '../controls/mouse';
import KEYBOARD    from '../controls/keyboard';
import TOUCHSCREEN from '../controls/touchscreen';

import CircularDoublyLinkedList from '../data-types/circular-doubly-linked-list';

import { addClass                   } from '../utils/classes';
import { removeClass                } from '../utils/classes';
import { makeElementFocusable       } from '../utils/focus-and-click';
import { makeChildElementsClickable } from '../utils/focus-and-click';
import { onFocus                    } from '../utils/focus-and-click';
import { onBlur                     } from '../utils/focus-and-click';
import { extend                     } from '../utils/uncategorized';
import { forEach                    } from '../utils/uncategorized';



export default class Carousel extends Component {
    constructor(element, options) {
        super(element, options);

        this.domCache = extend(this.domCache, {
            slides: new CircularDoublyLinkedList(element.querySelectorAll('.mui-slide')),
            controls: {
                prev: element.querySelectorAll('.prev'),
                next: element.querySelectorAll('.next')
            },
            indicators: element.querySelectorAll('.indicator')
        });

        this.state = extend(this.state, {
            numberOfSlides: this.domCache.slides.length,
            activeSlideIndex: 0,
            interval: (parseFloat(element.getAttribute('data-interval'), 10) || 5),
            isRotating: false,
            rotateInterval: null
        });

        this.initAria();
        this.initControls();
        this.makeSlideActive(0);
        this.startRotation();
    }


    initAria() {
        return this;
    }


    initControls() {
        MOUSE.onMouseOver(this.domCache.element, this.stopRotation.bind(this));
        MOUSE.onMouseOut(this.domCache.element, this.startRotation.bind(this));

        makeElementFocusable(this.domCache.element);

        onFocus(this.domCache.element, () => {
            this.stopRotation();

            forEach(this.domCache.controls.prev, (prev) => {
                addClass(prev, '-focused');
            });

            forEach(this.domCache.controls.next, (next) => {
                addClass(next, '-focused');
            });
        });

        onBlur(this.domCache.element, () => {
            this.startRotation();

            forEach(this.domCache.controls.prev, (prev) => {
                removeClass(prev, '-focused');
            });

            forEach(this.domCache.controls.next, (next) => {
                removeClass(next, '-focused');
            });
        });

        makeChildElementsClickable(this.domCache.element, this.domCache.controls.prev,
            this.rotatePrev.bind(this), { mouse: true, keyboard: false });
        makeChildElementsClickable(this.domCache.element, this.domCache.controls.next,
            this.rotateNext.bind(this), { mouse: true, keyboard: false });

        makeChildElementsClickable(this.domCache.element, this.domCache.indicators, (index) => {
            this.rotate(index);
        }, { mouse: true, keyboard: false });

        TOUCHSCREEN.onSwipeRight(this.domCache.element, this.rotatePrev.bind(this));
        TOUCHSCREEN.onSwipeLeft(this.domCache.element,  this.rotateNext.bind(this));

        KEYBOARD.onArrowLeftPressed(this.domCache.element, this.rotatePrev.bind(this));
        KEYBOARD.onArrowRightPressed(this.domCache.element, this.rotateNext.bind(this));

        return this;
    }


    restoreState() {
        if (!this.savedStates.isEmpty()) {
            const oldState = JSON.parse(this.savedStates.pop());

            this.rotate(oldState.activeSlideIndex);
        }

        return this;
    }


    startRotation() {
        if (!this.state.isRotating) {
            this.state.rotateInterval = setInterval(
                this.rotateNext.bind(this),
                this.state.interval * 1000);

            this.state.isRotating = true;
        }

        return this;
    }


    stopRotation() {
        clearInterval(this.state.rotateInterval);

        this.state.rotateInterval = null;
        this.state.isRotating = false;

        return this;
    }


    makeSlideActive(index) {
        const slide = this.domCache.slides.at(index);

        addClass(slide.data,      '-active');
        addClass(slide.prev.data, '-prev');
        addClass(slide.next.data, '-next');

        addClass(this.domCache.indicators[index], '-active');

        this.state.activeSlideIndex = index;

        return this;
    }


    makeSlideInactive(index) {
        const slide = this.domCache.slides.at(index);

        removeClass(slide.data,      '-active');
        removeClass(slide.prev.data, '-prev');
        removeClass(slide.next.data, '-next');

        removeClass(this.domCache.indicators[index], '-active');

        return this;
    }


    rotateNext() {
        this.makeSlideInactive(this.state.activeSlideIndex);

        this.state.activeSlideIndex =
            (this.state.activeSlideIndex + 1) % this.state.numberOfSlides;

        this.makeSlideActive(this.state.activeSlideIndex);
    }


    rotatePrev() {
        this.makeSlideInactive(this.state.activeSlideIndex);

        this.state.activeSlideIndex =
            ((this.state.activeSlideIndex + this.state.numberOfSlides) - 1)
                % this.state.numberOfSlides;

        this.makeSlideActive(this.state.activeSlideIndex);
    }


    rotate(index) {
        this.makeSlideInactive(this.state.activeSlideIndex);
        this.makeSlideActive(index);

        return this;
    }
}

