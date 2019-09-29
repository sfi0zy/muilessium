// -----------------------------------------------------------------------------
// DROPDOWN BUTTON
// -----------------------------------------------------------------------------


const KEYBOARD = window.Muilessium.KEYBOARD;
const FACTORY  = window.Muilessium.FACTORY;
const EVENTS   = window.Muilessium.EVENTS;
const _        = window.Muilessium.UTILS;


export default class ButtonDropdown extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.domCache = _.extend(this.domCache, {
            button:      element.querySelector('.mui-button'),
            dropdown:    element.querySelector('.mui-dropdown-options'),
            optionsList: element.querySelectorAll('.option'),
            shadow:      element.querySelector('.mui-shadow-toggle')
        });

        this.state = _.extend(this.state, {
            isOpened: false
        });

        this.initAria();
        this.initControls();
        this.initEvents();
    }


    initAria() {
        /* Remove role='button' added in base component */
        _.aria.removeRole(this.domCache.element);

        _.aria.set(this.domCache.button,   'haspopup', true);
        _.aria.set(this.domCache.dropdown, 'labelledby', _.aria.setId(this.domCache.button));
        _.aria.set(this.domCache.dropdown, 'hidden', true);
        _.aria.set(this.domCache.shadow,   'hidden', true);

        return this;
    }


    initControls() {
        _.makeElementClickable(this.domCache.button,
            this.toggleDropdown.bind(this, { focusFirstWhenOpened: false }),
            { mouse: true, keyboard: false });

        KEYBOARD.onEnterPressed(this.domCache.button,
            this.toggleDropdown.bind(this, { focusFirstWhenOpened: true }),
            { mouse: false, keyboard: true });

        KEYBOARD.onSpacePressed(this.domCache.button,
            this.toggleDropdown.bind(this, { focusFirstWhenOpened: true }),
            { mouse: false, keyboard: true });

        _.makeElementClickable(this.domCache.shadow,
            this.toggleDropdown.bind(this),
            { mouse: true, keyboard: false });


        _.forEach(this.domCache.optionsList, (option, index) => {
            _.makeElementClickable(option, () => {
                this.closeDropdown();
            });

            KEYBOARD.onArrowUpPressed(option, () => {
                if (option === _.firstOfList(this.domCache.optionsList)) {
                    this.closeDropdown();
                    this.domCache.button.focus();
                } else {
                    this.domCache.optionsList[index - 1].focus();
                }
            });

            KEYBOARD.onArrowDownPressed(option, () => {
                if (option === _.lastOfList(this.domCache.optionsList)) {
                    this.closeDropdown();
                    this.domCache.button.focus();
                } else {
                    this.domCache.optionsList[index + 1].focus();
                }
            });
        });

        KEYBOARD.onTabPressed(this.domCache.button, () => {
            _.goToNextFocusableElement(_.lastOfList(this.domCache.optionsList));
        });

        _.onFocus(_.lastOfList(this.domCache.optionsList), () => {
            if (!this.state.isOpened) {
                this.domCache.button.focus();
            }
        });

        KEYBOARD.onShiftTabPressed(_.firstOfList(this.domCache.optionsList), () => {
            this.closeDropdown();
            this.domCache.button.focus();
        });

        KEYBOARD.onTabPressed(_.lastOfList(this.domCache.optionsList), () => {
            this.closeDropdown();

            _.goToNextFocusableElement(_.lastOfList(_.getFocusableChilds(this.domCache.element)));
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

        return this;
    }


    restoreState() {
        if (!this.savedStates.isEmpty()) {
            const oldState = JSON.parse(this.savedStates.pop());

            if (oldState.isOpened) {
                this.openDropdown();
            } else {
                this.closeDropdown();
            }
        }

        return this;
    }


    openDropdown(focusFirst = true) {
        _.addClass(this.domCache.element,    '-opened');
        _.addClass(this.domCache.shadow, '-visible');

        _.aria.set(this.domCache.button,   'hidden', true);
        _.aria.set(this.domCache.dropdown, 'hidden', false);

        if (focusFirst) {
            _.firstOfList(_.getFocusableChilds(this.domCache.dropdown)).focus();
        }

        this.state.isOpened = true;

        return this;
    }


    closeDropdown() {
        _.removeClass(this.domCache.element,    '-opened');
        _.removeClass(this.domCache.shadow, '-visible');

        _.aria.set(this.domCache.button,   'hidden', false);
        _.aria.set(this.domCache.dropdown, 'hidden', true);

        this.domCache.button.focus();

        this.state.isOpened = false;

        return this;
    }


    toggleDropdown({ focusFirstWhenOpened = true }) {
        if (this.state.isOpened) {
            this.closeDropdown();
        } else {
            this.openDropdown(focusFirstWhenOpened);
        }

        return this;
    }
}

