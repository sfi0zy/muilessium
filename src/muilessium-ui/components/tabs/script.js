// -----------------------------------------------------------------------------
// TABS
// -----------------------------------------------------------------------------


const FACTORY     = window.Muilessium.FACTORY;
const KEYBOARD    = window.Muilessium.KEYBOARD;
const TOUCHSCREEN = window.Muilessium.TOUCHSCREEN;
const _           = window.Muilessium.UTILS;


export default class Tabs extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.domCache = _.extend(this.domCache, {
            tabs:          element.querySelectorAll('.tab'),
            labels:        element.querySelectorAll('.label'),
            labelsWrapper: element.querySelector('.labels')
        });

        this.state = _.extend(this.state, {
            current: 0
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        _.aria.setRole(this.domCache.labelsWrapper, 'tablist');

        _.forEach(this.domCache.labels, (label, index) => {
            _.aria.setRole(label, 'tab');
            _.aria.set(label, 'selected', false);
            _.aria.set(label, 'controls', _.aria.setId(this.domCache.tabs[index]));
        });

        _.forEach(this.domCache.tabs, (tab, index) => {
            _.aria.setRole(tab, 'tabpanel');
            _.aria.set(tab, 'hidden', true);
            _.aria.set(tab, 'labelledby', _.aria.setId(this.domCache.labels[index]));
        });

        _.addClass(this.domCache.tabs[0],   '-active');
        _.aria.set(this.domCache.tabs[0],   'hidden', false);
        _.addClass(this.domCache.labels[0], '-active');
        _.aria.set(this.domCache.labels[0], 'selected', true);

        return this;
    }


    initControls() {
        _.makeChildElementsClickable(this.domCache.element, this.domCache.labels, (index) => {
            this.makeTabInactive(this.state.current);
            this.makeTabActive(index);
        });

        _.forEach(this.domCache.labels, (label, index) => {
            if (index !== this.state.current) {
                _.makeElementNotFocusable(label);
            }

            KEYBOARD.onArrowLeftPressed(label, this.goToPreviousTab.bind(this));
            KEYBOARD.onArrowRightPressed(label, this.goToNextTab.bind(this));
        });

        TOUCHSCREEN.onSwipeRight(this.domCache.element, this.goToPreviousTab.bind(this));
        TOUCHSCREEN.onSwipeLeft(this.domCache.element, this.goToNextTab.bind(this));

        return this;
    }


    restoreState() {
        if (!this.savedStates.isEmpty()) {
            const oldState = JSON.parse(this.savedStates.pop());

            this.makeTabInactive(this.state.current);
            this.makeTabActive(oldState.current);
        }

        return this;
    }


    makeTabActive(index) {
        _.addClass(this.domCache.labels[index], '-active');
        _.addClass(this.domCache.tabs[index],   '-active');

        _.aria.set(this.domCache.labels[index], 'selected', true);
        _.aria.set(this.domCache.tabs[index], 'hidden', false);

        _.makeElementFocusable(this.domCache.labels[index]);
        this.domCache.labels[index].focus();

        this.state.current = index;

        return this;
    }


    makeTabInactive(index) {
        _.removeClass(this.domCache.labels[index], '-active');
        _.removeClass(this.domCache.tabs[index],   '-active');

        _.aria.set(this.domCache.labels[index], 'selected', false);
        _.aria.set(this.domCache.tabs[index], 'hidden', true);

        this.domCache.labels[index].blur();
        _.makeElementNotFocusable(this.domCache.labels[index]);

        return this;
    }


    goToPreviousTab() {
        if (this.state.current > 0) {
            this.makeTabInactive(this.state.current);
            this.makeTabActive(this.state.current - 1);
        }

        return this;
    }


    goToNextTab() {
        if (this.state.current < this.domCache.tabs.length - 1) {
            this.makeTabInactive(this.state.current);
            this.makeTabActive(this.state.current + 1);
        }

        return this;
    }
}

