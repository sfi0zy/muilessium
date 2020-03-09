// -----------------------------------------------------------------------------
// SPOILER
// -----------------------------------------------------------------------------


const FACTORY     = window.Muilessium.FACTORY;
const _           = window.Muilessium.UTILS;


export default class Spoiler extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.domCache = _.extend(this.domCache, {
            title:   element.querySelector('.title'),
            content: element.querySelector('.content')
        });

        this.state = _.extend(this.state, {
            isOpened: false
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        _.aria.setRole(this.domCache.element, 'tablist');

        _.aria.setRole(this.domCache.title, 'tab');
        _.aria.set(this.domCache.title, 'expanded', false);
        _.aria.set(this.domCache.title, 'controls', _.aria.setId(this.domCache.content));

        _.aria.setRole(this.domCache.content, 'tabpanel');
        _.aria.set(this.domCache.content, 'hidden', true);
        _.aria.set(this.domCache.content, 'labelledby', _.aria.setId(this.domCache.title));

        return this;
    }


    initControls() {
        _.makeElementClickable(this.domCache.title, this.toggle.bind(this));

        return this;
    }


    restoreState() {
        if (!this.savedStates.isEmpty()) {
            const oldState = JSON.parse(this.savedStates.pop());

            if (oldState.isOpened) {
                this.open();
            } else {
                this.close();
            }
        }

        return this;
    }


    open() {
        _.addClass(this.domCache.element, '-opened');

        _.aria.set(this.domCache.title,   'expanded', false);
        _.aria.set(this.domCache.content, 'hidden',   true);

        this.state.isOpened = true;

        return this;
    }


    toggle() {
        _.toggleClass(this.domCache.element, '-opened');

        _.aria.toggleState(this.domCache.title,   'expanded');
        _.aria.toggleState(this.domCache.content, 'hidden');

        this.state.isOpened = !this.state.isOpened;

        return this;
    }


    close() {
        _.removeClass(this.domCache.element, '-opened');

        _.aria.set(this.domCache.title,   'expanded', true);
        _.aria.set(this.domCache.content, 'hidden',   false);

        this.state.isOpened = false;

        return this;
    }
}

