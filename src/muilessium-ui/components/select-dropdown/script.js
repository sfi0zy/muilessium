// -----------------------------------------------------------------------------
// SELECT DROPDOWN
// -----------------------------------------------------------------------------


const FACTORY     = window.Muilessium.FACTORY;
const EVENTS      = window.Muilessium.EVENTS;
const KEYBOARD    = window.Muilessium.KEYBOARD;
const _           = window.Muilessium.UTILS;


export default class SelectDropdown extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.domCache = _.extend(this.domCache, {
            labels:      element.parentNode.querySelectorAll('label'),
            select:      element.querySelector('.select'),
            state:       element.querySelector('.state'),
            options:     element.querySelector('.mui-dropdown-options'),
            optionsList: element.querySelectorAll('.option'),
            shadow:      element.querySelector('.mui-shadow-toggle'),
            icon:        element.querySelector('.icon'),
            focusables:  []
        });

        this.state = _.extend(this.state, {
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

        _.setAttribute(hiddenSelect, 'id', id);
        _.setAttribute(hiddenSelect, 'name', id);

        this.domCache.hiddenSelect = hiddenSelect;

        _.addClass(this.domCache.hiddenSelect, '_hidden');
        _.aria.set(this.domCache.hiddenSelect, 'hidden', true);

        _.forEach(this.domCache.optionsList, (option) => {
            const hiddenOption = document.createElement('option');

            hiddenOption.value = _.getAttribute(option, 'data-value');
            
            this.domCache.hiddenSelect.add(hiddenOption);
        });

        return this;
    }


    initAria() {
        _.aria.setRole(this.domCache.select, 'listbox');

        _.forEach(this.domCache.optionsList, (option) => {
            _.aria.setRole(option, 'option');
            _.aria.setId(option);
        });

        _.aria.set(this.domCache.select, 'activedescendant',
            _.getAttribute(this.domCache.optionsList[this.state.selectedIndex], 'id'));
        _.aria.set(this.domCache.state, 'hidden', true);
        _.aria.set(this.domCache.icon, 'hidden', true);
        _.aria.set(this.domCache.shadow, 'hidden', true);

        _.ifNodeList(this.domCache.labels, () => {
            const selectId = _.aria.setId(this.domCache.select);

            _.forEach(this.domCache.labels, (label) => {
                _.setAttribute(label, 'for', selectId);
            });

            _.aria.set(this.domCache.select, 'labelledby', _.aria.setId(this.domCache.labels[0]));
        });

        return this;
    }

    
    initControls() { 
        _.makeElementClickable(this.domCache.select,
            this.toggleDropdown.bind(this, {
                focusFirstWhenOpened: false
            }),
            { mouse: true, keyboard: false }
        );

        _.makeElementClickable(this.domCache.select,
            this.toggleDropdown.bind(this, {
                focusFirstWhenOpened: true
            }),
            { mouse: false, keyboard: true }
        );

        KEYBOARD.onSpacePressed(this.domCache.select, this.toggleDropdown.bind(this));



        _.makeElementClickable(this.domCache.shadow, this.toggleDropdown.bind(this),
            { mouse: true, keyboard: false });


        _.ifNodeList(this.domCache.labels, () => {
            _.forEach(this.domCache.labels, (label) => {
                _.onFocus(label, () => {
                    this.domCache.select.focus();
                });
            });

            _.onFocus(this.domCache.select, () => {
                _.makeElementsNotFocusable(this.domCache.labels);
            });

            _.onBlur(this.domCache.select, () => {
                _.makeElementsFocusable(this.domCache.labels);
            });
        });


        _.makeChildElementsClickable(this.domCache.select, this.domCache.optionsList, (index) => {
            this.updateState(index);

            setTimeout(() => {
                this.closeDropdown();
            }, 50);
        });

        _.forEach(this.domCache.optionsList, (option, index) => {
            const goToPrevOption = () => {
                if (option === _.firstOfList(this.domCache.optionsList)) {
                    this.closeDropdown();
                } else {
                    this.domCache.optionsList[index - 1].focus();
                }
            };

            KEYBOARD.onArrowUpPressed(option, goToPrevOption);
            KEYBOARD.onShiftTabPressed(option, goToPrevOption);


            const goToNextOption = () => {
                if (option === _.lastOfList(this.domCache.optionsList)) {
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
                _.goToNextFocusableElement(this.domCache.hiddenSelect);
            }
        });


        _.onFocus(_.lastOfList(this.domCache.optionsList), () => {
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
                _.clearFocus();
            }
        });

        this.addEvent('update-state');

        return this;
    }


    restoreState() {
        if (!this.savedStates.isEmpty()) {
            const oldState = JSON.parse(this.savedStates.pop());

            this.updateState(oldState.selectedIndex);

            if (oldState.isOpened) {
                this.openDropdown();
            } else {
                this.closeDropdown();
            }
        }

        return this;
    }


    getSelectedIndex() {
        let result = 0;

        _.forEach(this.domCache.optionsList, (option, index) => {
            if (_.hasClass(option, '-selected')) {
                result = index;
            }
        });

        return result;
    }

    openDropdown(focusFirst = true) {
        this.state.isOpened = true;

        _.addClass(this.domCache.element, '-opened');
        _.addClass(this.domCache.shadow, '-visible');

        if (focusFirst) {
            _.firstOfList(this.domCache.optionsList).focus();
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

        _.removeClass(this.domCache.element, '-opened');
        _.removeClass(this.domCache.shadow, '-visible');

        this.domCache.select.focus();

        return this;
    }


    updateState(newSelectedIndex = 0) {
        if (newSelectedIndex < 0 || newSelectedIndex > this.domCache.optionsList.length - 1) {
            return this;
        }

        _.removeClass(this.domCache.optionsList[this.state.selectedIndex], '-selected');
        _.addClass(this.domCache.optionsList[newSelectedIndex], '-selected');

        this.state.selectedIndex = newSelectedIndex;
        this.domCache.state.innerHTML =
            this.domCache.optionsList[this.state.selectedIndex].innerHTML;
        this.domCache.hiddenSelect.selectedIndex = this.state.selectedIndex.toString();

        _.aria.set(this.domCache.select, 'activedescendant',
            _.getAttribute(this.domCache.optionsList[this.state.selectedIndex], 'id'));

        this.fireEvent('update-state');

        return this;
    }


    getState() {
        return this.state.selectedIndex;
    }
}

