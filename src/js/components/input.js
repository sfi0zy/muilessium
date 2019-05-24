// -----------------------------------------------------------------------------
// INPUT COMPONENT
// -----------------------------------------------------------------------------
//
// Methods list:
//  - (default) initAria()
//  - (default) initControls()
//  - (default) initEvents()
//  - validate()
//  - getValue()
//  - isValid()
//
// -----------------------------------------------------------------------------


import Component from '../component';

import aria from '../utils/aria';

import { setAttribute             } from '../utils/attributes';
import { getAttribute             } from '../utils/attributes';
import { ifExists                 } from '../utils/checks';
import { ifNodeList               } from '../utils/checks';
import { hasClass                 } from '../utils/classes';
import { addClass                 } from '../utils/classes';
import { removeClass              } from '../utils/classes';
import { removeClasses            } from '../utils/classes';
import { replaceClass             } from '../utils/classes';
import { makeElementsFocusable    } from '../utils/focus-and-click';
import { makeElementsNotFocusable } from '../utils/focus-and-click';
import { onFocus                  } from '../utils/focus-and-click';
import { onBlur                   } from '../utils/focus-and-click';
import { extend                   } from '../utils/uncategorized';
import { forEach                  } from '../utils/uncategorized';



export default class Input extends Component {
    constructor(element, options) {
        super(element, options);

        this.domCache = extend(this.domCache, {
            input:     element.querySelector('input'),
            labels:    element.parentNode.querySelectorAll('label'),
            hint:      element.parentNode.querySelector('.mui-input-hint'),
            indicator: element.parentNode.querySelector('.mui-input-indicator')
        });

        this.state = extend(this.state, {
            value:                  '',
            isValid:                true,
            regexp:                 new RegExp(getAttribute(element, 'data-regexp', '')),
            isValidationEnabled:    !hasClass(element, '-js-no-validation'),
            validationDelay:        getAttribute(element, 'data-validation-delay', 300),
            validationTimeout:      null
        });

        this.initAria();
        this.initControls();
        this.initEvents();
    }


    initAria() {
        const inputId = aria.setId(this.domCache.input);

        ifNodeList(this.domCache.labels, () => {
            aria.set(this.domCache.input, 'labelledby', aria.setId(this.domCache.labels[0]));

            forEach(this.domCache.labels, (label) => {
                setAttribute(label, 'for', inputId);
            });
        });

        return this;
    }


    initControls() {
        ifNodeList(this.domCache.labels, () => {
            forEach(this.domCache.labels, (label) => {
                onFocus(label, () => {
                    this.domCache.input.focus();
                });
            });
        });

        onFocus(this.domCache.input, this.focusHandler.bind(this));
        onBlur(this.domCache.input,  this.blurHandler.bind(this));

        this.domCache.input.addEventListener('change',  this.changeValueHandler.bind(this));
        this.domCache.input.addEventListener('keydown', this.changeValueHandler.bind(this));

        return this;
    }


    initEvents() {
        this.addEvent('update-state');
    }


    focusHandler() {
        addClass(this.domCache.element, '-focused');

        ifNodeList(this.domCache.labels, () => {
            makeElementsNotFocusable(this.domCache.labels);
        });

        return this;
    }


    blurHandler() {
        removeClass(this.domCache.element, '-focused');

        ifNodeList(this.domCache.labels, () => {
            makeElementsFocusable(this.domCache.labels);
        });

        return this;
    }


    changeValueHandler() { 
        this.state.value = this.domCache.input.value;

        if (this.state.value === '') {
            removeClasses(this.domCache.element, '-has-value', '-valid', '-invalid');

            ifExists(this.domCache.hint, () => {
                removeClasses(this.domCache.hint,      '-valid', '-invalid');
                removeClasses(this.domCache.indicator, '-valid', '-invalid');
            });
        } else {
            addClass(this.domCache.element, '-has-value');

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
                replaceClass(this.domCache.element,       '-invalid', '-valid');

                ifExists(this.domCache.hint, () => {
                    replaceClass(this.domCache.hint,      '-invalid', '-valid');
                    replaceClass(this.domCache.indicator, '-invalid', '-valid');
                });

                this.state.isValid = true;
            } else {
                replaceClass(this.domCache.element,       '-valid', '-invalid');

                ifExists(this.domCache.hint, () => {
                    replaceClass(this.domCache.hint,      '-valid', '-invalid');
                    replaceClass(this.domCache.indicator, '-valid', '-invalid');
                });

                this.state.isValid = false;
            }

            this.state.validationTimeout = null;
        }

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

