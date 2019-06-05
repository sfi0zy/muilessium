// -----------------------------------------------------------------------------
// CHECKBOX
// -----------------------------------------------------------------------------


const FACTORY     = window.Muilessium.FACTORY;
const KEYBOARD    = window.Muilessium.KEYBOARD;
const _           = window.Muilessium.UTILS;


export default class Checkbox extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.domCache = _.extend(this.domCache, {
            input: element.querySelector('input'),
            label: element.querySelector('label'),
        });

        this.state = _.extend(this.state, {
            isChecked: this.domCache.input.checked
        });

        this.initAria();
        this.initControls();
        this.initEvents();
    }


    initAria() {
        _.aria.setRole(this.domCache.label, 'checkbox');

        const inputId = _.aria.setId(this.domCache.input);

        _.setAttribute(this.domCache.label, 'for', inputId);

        _.aria.set(this.domCache.label, 'controls', inputId);
        _.aria.set(this.domCache.input, 'labelledby', _.aria.setId(this.domCache.label));

        if (this.state.isChecked) {
            this.setCheckbox();
        } else {
            this.unsetCheckbox();
        }

        return this;
    }


    initControls() {
        _.makeElementClickable(this.domCache.label, this.toggleCheckbox.bind(this));

        KEYBOARD.onSpacePressed(this.domCache.label, this.toggleCheckbox.bind(this));

        return this;
    }


    initEvents() {
        this.addEvent('update-state');
    }


    restoreState() {
        if (!this.savedStates.isEmpty()) {
            const oldState = JSON.parse(this.savedStates.pop());

            if (oldState.isChecked) {
                this.setCheckbox();
            } else {
                this.unsetCheckbox();
            }
        }

        return this;
    }


    setCheckbox() {
        this.state.isChecked = true;
        this.domCache.input.checked = true;

        _.addClass(this.domCache.element, '-checked');
        _.aria.set(this.domCache.label, 'checked', true);

        this.fireEvent('update-state');

        return this;
    }


    unsetCheckbox() {
        this.state.isChecked = false;
        this.domCache.input.checked = false;

        _.removeClass(this.domCache.element, '-checked');
        _.aria.set(this.domCache.label, 'checked', false);

        this.fireEvent('update-state');

        return this;
    }


    toggleCheckbox() {
        if (this.state.isChecked) {
            this.unsetCheckbox();
        } else {
            this.setCheckbox();
        }

        return this;
    }


    getState() {
        return this.state.isChecked;
    }
}

