// -----------------------------------------------------------------------------
// RADIO
// -----------------------------------------------------------------------------


const FACTORY     = window.Muilessium.FACTORY;
const _           = window.Muilessium.UTILS;


export default class Radio extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.domCache = _.extend(this.domCache, {
            inputs:     element.querySelectorAll('input'),
            labels:     element.querySelectorAll('label'),
            inputLabel: element.parentNode.querySelector('.mui-input-label'),
            icons:      element.querySelectorAll('.icon')
        });

        this.state = _.extend(this.state, {
            checkedIndex: -1
        });

        this.initAria();
        this.initControls();
        this.initEvents();
        this.updateState();
    }


    initAria() {
        _.aria.setRole(this.domCache.element, 'radiogroup');

        _.ifExists(this.domCache.inputLabel, () => {
            _.aria.set(this.domCache.element, 'labelledby', _.aria.setId(this.domCache.inputLabel));
            _.setAttribute(this.domCache.inputLabel, 'for', _.aria.setId(this.domCache.element));
        });

        _.forEach(this.domCache.inputs, (input, index) => {
            _.aria.set(input, 'hidden', true);
            _.setAttribute(input, 'type', 'radio');
            _.setAttribute(input, 'name', _.getAttribute(this.domCache.element, 'data-name'));

            if (input.checked) {
                this.state.checkedIndex = index;
            }
        });

        _.forEach(this.domCache.labels, (label, index) => {
            _.setAttribute(label, 'for', _.getAttribute(this.domCache.inputs[index], 'id'));
            _.aria.setRole(label, 'radio');
        });

        return this;
    }


    initControls() {
        _.makeChildElementsClickable(this.domCache.element, this.domCache.labels, (index) => {
            this.updateState(index);
        });

        return this;
    }


    initEvents() {
        this.addEvent('update-state');
    }


    restoreState() {
        if (!this.savedStates.isEmpty()) {
            const oldState = JSON.parse(this.savedStates.pop());

            this.updateState(oldState.checkedIndex);
        }

        return this;
    }


    updateState(index) {
        if ((typeof index !== 'number') || (index > this.domCache.inputs.length - 1)) {
            return this;
        }

        if (this.state.checkedIndex >= 0) {
            this.domCache.inputs[this.state.checkedIndex].checked = false;
            _.aria.set(this.domCache.labels[this.state.checkedIndex], 'checked', false);
        }

        if (index >= 0) {
            this.domCache.inputs[index].checked = true;

            _.aria.set(this.domCache.labels[index], 'checked', true);
        }

        this.state.checkedIndex = index;

        this.fireEvent('update-state');

        return this;
    }


    getState() {
        return this.state.checkedIndex;
    }
}

