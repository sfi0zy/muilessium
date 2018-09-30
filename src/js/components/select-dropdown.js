// -----------------------------------------------------------------------------
// SELECT DROPDOWN COMPONENT
// -----------------------------------------------------------------------------
//
// Methods list:
//  - (default) initAria()
//  - (default) initControls()
//  - (default) initEvents()
//  - getSelectedIndex()
//  - openDropdown()
//  - closeDropdown()
//  - toggleDropdown()
//  - updateState(newIndex = 0)
//  - getState(newIndex = 0)
//
// -----------------------------------------------------------------------------


import Component from '../component';

import EVENTS from '../events';

import KEYBOARD from '../controls/keyboard';

import aria from '../utils/aria';

import { getAttribute                 } from '../utils/attributes';
import { setAttribute                 } from '../utils/attributes';
import { addClass                     } from '../utils/classes';
import { removeClass                  } from '../utils/classes';
import { hasClass                     } from '../utils/classes';
import { ifNodeList                   } from '../utils/checks';
import { makeElementClickable         } from '../utils/focus-and-click';
import { makeChildElementsClickable   } from '../utils/focus-and-click';
import { makeElementsFocusable        } from '../utils/focus-and-click';
import { makeElementsNotFocusable     } from '../utils/focus-and-click';
import { goToNextFocusableElement     } from '../utils/focus-and-click';
import { onFocus                      } from '../utils/focus-and-click';
import { onBlur                       } from '../utils/focus-and-click';
import { clearFocus                   } from '../utils/focus-and-click';
import { extend                       } from '../utils/uncategorized';
import { forEach                      } from '../utils/uncategorized';
import { firstOfList                  } from '../utils/uncategorized';
import { lastOfList                   } from '../utils/uncategorized';



export default class SelectDropdown extends Component {
    constructor(element, options) {
        super(element, options);

        this.domCache = extend(this.domCache, {
            labels:      element.parentNode.querySelectorAll('label'),
            select:      element.querySelector('.select'),
            state:       element.querySelector('.state'),
            options:     element.querySelector('.mui-dropdown-options'),
            optionsList: element.querySelectorAll('.option'),
            shadow:      element.querySelector('.mui-shadow-toggle'),
            icon:        element.querySelector('.icon'),
            focusables:  []
        });

        this.state = extend(this.state, {
            selectedIndex: this.getSelectedIndex(),
            isOpened: false
        });

        this.createHiddenSelect();
        this.initAria();
        this.initControls();
        this.initEvents();
        this.updateState();
    }


    createHiddenSelect() {
        const hiddenSelect = document.createElement('select');
        const id = this.domCache.select.getAttribute('data-id');

        this.domCache.element.appendChild(hiddenSelect);

        setAttribute(hiddenSelect, 'id', id);
        setAttribute(hiddenSelect, 'name', id);

        this.domCache.hiddenSelect = hiddenSelect;

        addClass(this.domCache.hiddenSelect, '_hidden');
        aria.set(this.domCache.hiddenSelect, 'hidden', true);

        forEach(this.domCache.optionsList, (option) => {
            const hiddenOption = document.createElement('option');

            hiddenOption.value = getAttribute(option, 'data-value');
            
            this.domCache.hiddenSelect.add(hiddenOption);
        });

        return this;
    }


    initAria() {
        aria.setRole(this.domCache.select, 'listbox');

        forEach(this.domCache.optionsList, (option) => {
            aria.setRole(option, 'option');
            aria.setId(option);
        });

        aria.set(this.domCache.select, 'activedescendant',
            getAttribute(this.domCache.optionsList[this.state.selectedIndex], 'id'));
        aria.set(this.domCache.state, 'hidden', true);
        aria.set(this.domCache.icon, 'hidden', true);
        aria.set(this.domCache.shadow, 'hidden', true);

        ifNodeList(this.domCache.labels, () => {
            const selectId = aria.setId(this.domCache.select);

            forEach(this.domCache.labels, (label) => {
                setAttribute(label, 'for', selectId);
            });

            aria.set(this.domCache.select, 'labelledby', aria.setId(this.domCache.labels[0]));
        });

        return this;
    }

    
    initControls() { 
        makeElementClickable(this.domCache.select,
            this.toggleDropdown.bind(this, {
                focusFirstWhenOpened: false
            }),
            { mouse: true, keyboard: false }
        );

        makeElementClickable(this.domCache.select,
            this.toggleDropdown.bind(this, {
                focusFirstWhenOpened: true
            }),
            { mouse: false, keyboard: true }
        );

        KEYBOARD.onSpacePressed(this.domCache.select, this.toggleDropdown.bind(this));



        makeElementClickable(this.domCache.shadow, this.toggleDropdown.bind(this),
            { mouse: true, keyboard: false });


        ifNodeList(this.domCache.labels, () => {
            forEach(this.domCache.labels, (label) => {
                onFocus(label, () => {
                    this.domCache.select.focus();
                });
            });

            onFocus(this.domCache.select, () => {
                makeElementsNotFocusable(this.domCache.labels);
            });

            onBlur(this.domCache.select, () => {
                makeElementsFocusable(this.domCache.labels);
            });
        });


        makeChildElementsClickable(this.domCache.select, this.domCache.optionsList, (index) => {
            this.updateState(index);

            setTimeout(() => {
                this.closeDropdown();
            }, 50);
        });

        forEach(this.domCache.optionsList, (option, index) => {
            const goToPrevOption = () => {
                if (option === firstOfList(this.domCache.optionsList)) {
                    this.closeDropdown();
                } else {
                    this.domCache.optionsList[index - 1].focus();
                }
            };

            KEYBOARD.onArrowUpPressed(option, goToPrevOption);
            KEYBOARD.onShiftTabPressed(option, goToPrevOption);


            const goToNextOption = () => {
                if (option === lastOfList(this.domCache.optionsList)) {
                    this.closeDropdown();
                } else {
                    this.domCache.optionsList[index + 1].focus();
                }
            };

            KEYBOARD.onArrowDownPressed(option, goToNextOption);
            KEYBOARD.onTabPressed(option, goToNextOption);

            KEYBOARD.onEscapePressed(option, () => {
                this.closeDropdown();
            });
        });


        KEYBOARD.onTabPressed(this.domCache.select, () => {
            if (!this.state.isOpened) {
                goToNextFocusableElement(this.domCache.hiddenSelect);
            }
        });


        onFocus(lastOfList(this.domCache.optionsList), () => {
            if (!this.state.isOpened) {
                this.domCache.select.focus();
            }
        });

        return this;
    }


    initEvents() {
        EVENTS.addEventListener('scroll-start', () => {
            if (this.state.isOpened) {
                this.closeDropdown();
                clearFocus();
            }
        });

        return this;
    }


    getSelectedIndex() {
        let result = 0;

        forEach(this.domCache.optionsList, (option, index) => {
            if (hasClass(option, '-selected')) {
                result = index;
            }
        });

        return result;
    }

    openDropdown(focusFirst = true) {
        this.state.isOpened = true;

        addClass(this.domCache.element, '-opened');
        addClass(this.domCache.shadow, '-visible');

        if (focusFirst) {
            firstOfList(this.domCache.optionsList).focus();
        }
    
        return this;
    }

    toggleDropdown(focusFirstWhenOpened = true) {
        if (this.state.isOpened) {
            this.closeDropdown();
        } else {
            this.openDropdown(focusFirstWhenOpened);
        }

        return this;
    }


    closeDropdown() {
        this.state.isOpened = false;

        removeClass(this.domCache.element, '-opened');
        removeClass(this.domCache.shadow, '-visible');

        this.domCache.select.focus();

        return this;
    }


    updateState(newSelectedIndex = 0) {
        if (newSelectedIndex < 0 || newSelectedIndex > this.domCache.optionsList.length - 1) {
            return this;
        }

        removeClass(this.domCache.optionsList[this.state.selectedIndex], '-selected');
        addClass(this.domCache.optionsList[newSelectedIndex], '-selected');

        this.state.selectedIndex = newSelectedIndex;
        this.domCache.state.innerHTML =
            this.domCache.optionsList[this.state.selectedIndex].innerHTML;
        this.domCache.hiddenSelect.selectedIndex = this.state.selectedIndex.toString();

        aria.set(this.domCache.select, 'activedescendant',
            getAttribute(this.domCache.optionsList[this.state.selectedIndex], 'id'));

        return this;
    }


    getState() {
        return this.state.selectedIndex;
    }
}

