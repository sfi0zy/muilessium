// -----------------------------------------------------------------------------
// ACCORDION
// -----------------------------------------------------------------------------


const KEYBOARD = window.Muilessium.KEYBOARD;
const FACTORY  = window.Muilessium.FACTORY;
const _        = window.Muilessium.UTILS;


export default class Accordion extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.domCache = _.extend(this.domCache, {
            items:      element.querySelectorAll('.item'),
            titles:     element.querySelectorAll('.title'),
            indicators: element.querySelectorAll('.indicator'),
            contents:   element.querySelectorAll('.content')
        });

        this.state = _.extend(this.state, {
            isExpanded: []
        });

        _.forEach(this.domCache.items, (item, index) => {
            this.state.isExpanded[index] = false;
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        _.aria.setRole(this.domCache.element, 'tablist');
        _.setAttribute(this.domCache.element, 'multiselectable', true);

        _.forEach(this.domCache.titles, (title, index) => {
            _.aria.setRole(title, 'tab');
            _.aria.set(title, 'expanded', false);
            _.aria.set(title, 'controls', _.aria.setId(this.domCache.contents[index]));
        });

        _.forEach(this.domCache.contents, (content, index) => {
            _.aria.setRole(content, 'tabpanel');
            _.aria.set(content, 'hidden', true);
            _.aria.set(content, 'labelledby', _.aria.setId(this.domCache.titles[index]));
        });

        _.forEach(this.domCache.indicators, (indicator) => {
            _.aria.set(indicator, 'hidden', true);
        });

        return this;
    }


    initControls() {
        _.makeChildElementsClickable(this.domCache.element, this.domCache.titles, (index) => {
            this.toggleItem(index);
        });

        _.forEach(this.domCache.titles, (title, index) => {
            KEYBOARD.onSpacePressed(title, this.toggleItem.bind(this, index));

            if (title !== _.firstOfList(this.domCache.titles)) {
                KEYBOARD.onArrowUpPressed(title, () => {
                    this.domCache.titles[index - 1].focus();
                });
            }

            if (title !== _.lastOfList(this.domCache.titles)) {
                KEYBOARD.onArrowDownPressed(title, () => {
                    this.domCache.titles[index + 1].focus();
                });
            }
        });

        return this;
    }


    restoreState() {
        if (!this.savedStates.isEmpty()) {
            const oldState = JSON.parse(this.savedStates.pop());

            _.forEach(oldState.isExpanded, (isExpanded, index) => {
                if (isExpanded) {
                    this.unfoldItem(index);
                } else {
                    this.foldItem(index);
                }
            });
        }

        return this;
    }


    foldItem(index) {
        _.removeClass(this.domCache.items[index], '-unfold');

        _.aria.set(this.domCache.titles[index],   'expanded', false);
        _.aria.set(this.domCache.contents[index], 'hidden',   true);

        this.state.isExpanded[index] = false;

        return this;
    }


    foldAllItems() {
        _.forEach(this.domCache.items, (item, index) => {
            this.foldItem(index);
        });

        return this;
    }


    unfoldItem(index) {
        _.addClass(this.domCache.items[index], '-unfold');

        _.aria.set(this.domCache.titles[index],   'expanded', true);
        _.aria.set(this.domCache.contents[index], 'hidden',   false);

        this.state.isExpanded[index] = true;

        return this;
    }


    unfoldAllItems() {
        _.forEach(this.domCache.items, (item, index) => {
            this.unfoldItem(index);
        });

        return this;
    }


    toggleItem(index) {
        _.toggleClass(this.domCache.items[index], '-unfold');

        _.aria.toggleState(this.domCache.titles[index],   'expanded');
        _.aria.toggleState(this.domCache.contents[index], 'hidden');

        this.state.isExpanded[index] = !this.state.isExpanded[index];

        return this;
    }
}

