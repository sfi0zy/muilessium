// -----------------------------------------------------------------------------
// CAROUSEL
// -----------------------------------------------------------------------------


const FACTORY     = window.Muilessium.FACTORY;
const MOUSE       = window.Muilessium.MOUSE;
const KEYBOARD    = window.Muilessium.KEYBOARD;
const TOUCHSCREEN = window.Muilessium.TOUCHSCREEN;
const DATA_TYPES  = window.Muilessium.DATA_TYPES;
const _           = window.Muilessium.UTILS;


export default class Carousel extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.domCache = _.extend(this.domCache, {
            slides: new DATA_TYPES.CircularDoublyLinkedList(element.querySelectorAll('.mui-slide')),
            controls: {
                prev: element.querySelectorAll('.prev'),
                next: element.querySelectorAll('.next')
            },
            indicators: element.querySelectorAll('.indicator')
        });

        this.state = _.extend(this.state, {
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

        _.makeElementFocusable(this.domCache.element);

        _.onFocus(this.domCache.element, () => {
            this.stopRotation();

            _.forEach(this.domCache.controls.prev, (prev) => {
                _.addClass(prev, '-focused');
            });

            _.forEach(this.domCache.controls.next, (next) => {
                _.addClass(next, '-focused');
            });
        });

        _.onBlur(this.domCache.element, () => {
            this.startRotation();

            _.forEach(this.domCache.controls.prev, (prev) => {
                _.removeClass(prev, '-focused');
            });

            _.forEach(this.domCache.controls.next, (next) => {
                _.removeClass(next, '-focused');
            });
        });

        _.makeChildElementsClickable(this.domCache.element, this.domCache.controls.prev,
            this.rotatePrev.bind(this), { mouse: true, keyboard: false });
        _.makeChildElementsClickable(this.domCache.element, this.domCache.controls.next,
            this.rotateNext.bind(this), { mouse: true, keyboard: false });

        _.makeChildElementsClickable(this.domCache.element, this.domCache.indicators, (index) => {
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

        _.addClass(slide.data,      '-active');
        _.addClass(slide.prev.data, '-prev');
        _.addClass(slide.next.data, '-next');

        _.addClass(this.domCache.indicators[index], '-active');

        this.state.activeSlideIndex = index;

        return this;
    }


    makeSlideInactive(index) {
        const slide = this.domCache.slides.at(index);

        _.removeClass(slide.data,      '-active');
        _.removeClass(slide.prev.data, '-prev');
        _.removeClass(slide.next.data, '-next');

        _.removeClass(this.domCache.indicators[index], '-active');

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

