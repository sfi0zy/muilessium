// -----------------------------------------------------------------------------
// TEXTAREA
// -----------------------------------------------------------------------------


const FACTORY = window.Muilessium.FACTORY;
const _       = window.Muilessium.UTILS;


export default class Textarea extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);
        
        this.domCache = _.extend(this.domCache, {
            textarea: element.querySelector('textarea'),
            labels:   element.parentNode.querySelectorAll('label')
        });

        this.state = _.extend(this.state, {
            value: ''
        });

        this.initAria();
        this.initControls();
        this.initEvents();
    }


    initAria() {
        const textareaId = _.aria.setId(this.domCache.textarea);

        _.ifNodeList(this.domCache.labels, () => {
            _.aria.set(this.domCache.textarea, 'labelledby', _.aria.setId(this.domCache.labels[0]));

            _.forEach(this.domCache.labels, (label) => {
                _.setAttribute(label, 'for', textareaId);
            });
        }, false);

        return this;
    }


    initControls() {
        _.ifNodeList(this.domCache.labels, () => {
            _.forEach(this.domCache.labels, (label) => {
                _.onFocus(label, () => {
                    this.domCache.textarea.focus();
                });
            });
        }, false);

        _.onFocus(this.domCache.textarea,  this.focusEventHandler.bind(this));
        _.onBlur(this.domCache.textarea,   this.blurEventHandler.bind(this));

        this.domCache.textarea.addEventListener('change', this.changeEventHandler.bind(this));

        return this;
    }


    initEvents() {
        this.addEvent('update-state');
    }


    restoreState() {
        if (!this.savedStates.isEmpty()) {
            const oldState = JSON.parse(this.savedStates.pop());

            this.domCache.textarea.value = oldState.value;
            this.changeEventHandler();
        }

        return this;
    }


    focusEventHandler() {
        _.addClass(this.domCache.element, '-focused');

        _.ifNodeList(this.domCache.labels, () => {
            _.makeElementsNotFocusable(this.domCache.labels);
        });
    }


    blurEventHandler() {
        _.removeClass(this.domCache.element, '-focused');

        _.ifNodeList(this.domCache.labels, () => {
            _.makeElementsFocusable(this.domCache.labels);
        });
    }


    changeEventHandler() {
        this.state.value = this.domCache.textarea.value;

        if (this.state.value === '') {
            _.removeClass(this.domCache.element, '-has-value');
        } else {
            _.addClass(this.domCache.element, '-has-value');
        }

        this.fireEvent('update-state');
    }


    setValue(value) {
        this.domCache.textarea.value = value;

        this.changeEventHandler();

        return this;
    }


    getValue() {
        if (this.state.value !== this.domCache.textarea.value) {
            this.changeEventHandler();
        }

        return this.state.value;
    }
}

