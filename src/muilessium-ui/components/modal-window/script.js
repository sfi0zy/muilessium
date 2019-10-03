// -----------------------------------------------------------------------------
// MODAL WINDOW
// -----------------------------------------------------------------------------


const FACTORY     = window.Muilessium.FACTORY;
const EVENTS      = window.Muilessium.EVENTS;
const KEYBOARD    = window.Muilessium.KEYBOARD;
const TOUCHSCREEN = window.Muilessium.TOUCHSCREEN;
const _           = window.Muilessium.UTILS;


export default class ModalWindow extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.domCache = _.extend(this.domCache, {
            openers:     document.querySelectorAll(`[data-modal-opener=${element.getAttribute('id')}]`),
            modalWindow: element.querySelector('.window'),
            closeIcon:   element.querySelector('.closeicon'),
            shadow:      element.querySelector('.mui-shadow-toggle')
        });

        this.state = _.extend(this.state, {
            isOpened: false,
            savedOpener: null
        });

        this.initAria();
        this.initControls();
        this.initEvents();
    }


    initAria() {
        _.aria.set(this.domCache.element, 'hidden', true);
        _.aria.set(this.domCache.shadow,  'hidden', true);

        return this;
    }


    initControls() {
        _.forEach(this.domCache.openers, (opener) => {
            _.makeElementClickable(opener, () => {
                this.state.savedOpener = opener;
                this.openModal();
            });

            KEYBOARD.onSpacePressed(opener, () => {
                this.state.savedOpened = opener;
                this.openModal();
            });
        });

        KEYBOARD.onEscapePressed(this.domCache.modalWindow, this.closeModal.bind(this));
        KEYBOARD.onTabPressed(this.domCache.modalWindow, this.closeModal.bind(this));
        KEYBOARD.onShiftTabPressed(this.domCache.modalWindow, this.closeModal.bind(this));
        
        _.makeElementClickable(this.domCache.closeIcon, this.closeModal.bind(this),
            { mouse: true, keyboard: false });
        _.makeElementClickable(this.domCache.shadow, this.closeModal.bind(this),
            { mouse: true, keyboard: false });

        TOUCHSCREEN.onPinchOut(this.domCache.modalWindow, this.closeModal.bind(this));

        return this;
    }


    initEvents() {
        EVENTS.addEventListener('scroll-start', () => {
            if (this.state.isOpened) {
                this.closeModal({ returnToOpener: false });
                _.clearFocus();
            }
        });

        this.addEvent('open-modal');
        this.addEvent('close-modal');

        return this;
    }


    restoreState() {
        if (!this.savedStates.isEmpty()) {
            const oldState = JSON.parse(this.savedStates.pop());

            if (oldState.isOpened) {
                this.openModal();
            } else {
                this.closeModal();
            }
        }

        return this;
    }


    openModal() {
        if (!this.state.isOpened) {
            _.addClass(this.domCache.element, '-opened');
            _.addClass(this.domCache.shadow,  '-visible');
            
            _.aria.set(this.domCache.element, 'hidden', false);

            _.makeElementFocusable(this.domCache.modalWindow);
            this.state.isOpened = true;

            this.domCache.modalWindow.focus();

            this.fireEvent('open-modal');
        }

        return this;
    }


    closeModal({ returnToOpener = true }) {
        if (this.state.isOpened) {
            _.removeClass(this.domCache.element, '-opened');
            _.removeClass(this.domCache.shadow,  '-visible');
            
            _.aria.set(this.domCache.element, 'hidden', true);

            _.makeElementNotFocusable(this.domCache.modalWindow);
            this.state.isOpened = false;

            if (this.state.savedOpener && returnToOpener && !_.isInViewport(this.state.savedOpener)) {
                _.scrollTo(this.state.savedOpener, () => {
                    this.state.savedOpener.focus();
                    this.state.savedOpener = null;
                });
            }

            this.fireEvent('close-modal');
        }

        return this;
    }
}

