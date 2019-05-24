// -----------------------------------------------------------------------------
// CHECKBOX COMPONENT
// -----------------------------------------------------------------------------
//
// Methods list:
//  - (default) initAria()
//  - (default) initControls()
//  - (default) initEvents()
//  - setCheckbox()
//  - unsetCheckbox()
//  - toggleCheckbox()
//  - getState()
//
// -----------------------------------------------------------------------------


import Component from '../component';

import KEYBOARD from '../controls/keyboard';

import aria from '../utils/aria';

import { setAttribute          } from '../utils/attributes';
import { addClass              } from '../utils/classes';
import { removeClass           } from '../utils/classes';
import { makeElementClickable  } from '../utils/focus-and-click';
import { extend                } from '../utils/uncategorized';



export default class Checkbox extends Component {
    constructor(element, options) {
        super(element, options);

        this.domCache = extend(this.domCache, {
            input: element.querySelector('input'),
            label: element.querySelector('label'),
        });

        this.state = extend(this.state, {
            isChecked: this.domCache.input.checked
        });

        this.initAria();
        this.initControls();
        this.initEvents();
    }


    initAria() {
        aria.setRole(this.domCache.label, 'checkbox');

        const inputId = aria.setId(this.domCache.input);

        setAttribute(this.domCache.label, 'for', inputId);

        aria.set(this.domCache.label, 'controls', inputId);
        aria.set(this.domCache.input, 'labelledby', aria.setId(this.domCache.label));

        if (this.state.isChecked) {
            this.setCheckbox();
        } else {
            this.unsetCheckbox();
        }

        return this;
    }


    initControls() {
        makeElementClickable(this.domCache.label, this.toggleCheckbox.bind(this));

        KEYBOARD.onSpacePressed(this.domCache.label, this.toggleCheckbox.bind(this));

        return this;
    }


    initEvents() {
        this.addEvent('update-state');
    }


    setCheckbox() {
        this.state.isChecked = true;
        this.domCache.input.checked = true;

        addClass(this.domCache.element, '-checked');
        aria.set(this.domCache.label, 'checked', true);

        this.fireEvent('update-state');

        return this;
    }


    unsetCheckbox() {
        this.state.isChecked = false;
        this.domCache.input.checked = false;

        removeClass(this.domCache.element, '-checked');
        aria.set(this.domCache.label, 'checked', false);

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

