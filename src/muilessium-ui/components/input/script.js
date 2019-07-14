// -----------------------------------------------------------------------------
// INPUT
// -----------------------------------------------------------------------------


const FACTORY     = window.Muilessium.FACTORY;
const _           = window.Muilessium.UTILS;


export default class Input extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.domCache = _.extend(this.domCache, {
            input:     element.querySelector('input'),
            labels:    element.parentNode.querySelectorAll('label'),
            hint:      element.parentNode.querySelector('.mui-input-hint'),
            indicator: element.parentNode.querySelector('.mui-input-indicator')
        });

        this.state = _.extend(this.state, {
            value:                  '',
            isValid:                true,
            regexp:                 new RegExp(_.getAttribute(element, 'data-regexp', '')),
            isValidationEnabled:    !_.hasClass(element, '-js-no-validation'),
            validationDelay:        _.getAttribute(element, 'data-validation-delay', 300),
            validationTimeout:      null
        });

        this.initAria();
        this.initControls();
        this.initEvents();
    }


    initAria() {
        const inputId = _.aria.setId(this.domCache.input);

        _.ifNodeList(this.domCache.labels, () => {
            _.aria.set(this.domCache.input, 'labelledby', _.aria.setId(this.domCache.labels[0]));

            _.forEach(this.domCache.labels, (label) => {
                _.setAttribute(label, 'for', inputId);
            });
        });

        return this;
    }


    initControls() {
        _.ifNodeList(this.domCache.labels, () => {
            _.forEach(this.domCache.labels, (label) => {
                _.onFocus(label, () => {
                    this.domCache.input.focus();
                });
            });
        });

        _.onFocus(this.domCache.input, this.focusHandler.bind(this));
        _.onBlur(this.domCache.input,  this.blurHandler.bind(this));

        this.domCache.input.addEventListener('change',  this.changeValueHandler.bind(this));
        this.domCache.input.addEventListener('keydown', this.changeValueHandler.bind(this));

        return this;
    }


    initEvents() {
        this.addEvent('update-state');
    }


    restoreState() {
        if (!this.savedStates.isEmpty()) {
            const oldState = JSON.parse(this.savedStates.pop());

            this.domCache.input.value = oldState.value;

            this.changeValueHandler();
        }

        return this;
    }


    focusHandler() {
        _.addClass(this.domCache.element, '-focused');

        _.ifNodeList(this.domCache.labels, () => {
            _.makeElementsNotFocusable(this.domCache.labels);
        });

        return this;
    }


    blurHandler() {
        _.removeClass(this.domCache.element, '-focused');

        _.ifNodeList(this.domCache.labels, () => {
            _.makeElementsFocusable(this.domCache.labels);
        });

        return this;
    }


    changeValueHandler() { 
        this.state.value = this.domCache.input.value;

        if (this.state.value === '') {
            _.removeClasses(this.domCache.element, '-has-value', '-valid', '-invalid');

            _.ifExists(this.domCache.hint, () => {
                _.removeClasses(this.domCache.hint,      '-valid', '-invalid');
                _.removeClasses(this.domCache.indicator, '-valid', '-invalid');
            });
        } else {
            _.addClass(this.domCache.element, '-has-value');

            let { validationTimeout } = this.state;

            if (validationTimeout) {
                clearTimeout(validationTimeout);
            }

            validationTimeout = setTimeout(this.validate.bind(this), this.state.validationDelay);
        }

        this.fireEvent('update-state');

        return this;
    }

    
    validate() {
        if (this.state.isValidationEnabled) {
            if (this.state.regexp.test(this.state.value)) {
                _.replaceClass(this.domCache.element,       '-invalid', '-valid');

                _.ifExists(this.domCache.hint, () => {
                    _.replaceClass(this.domCache.hint,      '-invalid', '-valid');
                    _.replaceClass(this.domCache.indicator, '-invalid', '-valid');
                });

                this.state.isValid = true;
            } else {
                _.replaceClass(this.domCache.element,       '-valid', '-invalid');

                _.ifExists(this.domCache.hint, () => {
                    _.replaceClass(this.domCache.hint,      '-valid', '-invalid');
                    _.replaceClass(this.domCache.indicator, '-valid', '-invalid');
                });

                this.state.isValid = false;
            }

            this.state.validationTimeout = null;
        }

        return this;
    }


    setValue(value) {
        this.domCache.input.value = value;

        this.changeValueHandler();

        return this;
    }


    getValue() {
        return this.state.value;
    }


    isValid() {
        this.validate();

        return this.state.isValid;
    }
}

