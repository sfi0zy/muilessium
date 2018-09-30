// -----------------------------------------------------------------------------
// MODAL WINDOW COMPONENT
// -----------------------------------------------------------------------------
//
// Methods list:
//  - (default) initAria()
//  - (default) initControls()
//  - (default) initEvents()
//  - openModal()
//  - closeModal()
//
// -----------------------------------------------------------------------------


import Component from '../component';

import EVENTS from '../events';

import KEYBOARD    from '../controls/keyboard';
import TOUCHSCREEN from '../controls/touchscreen';

import aria from '../utils/aria';

import { addClass                     } from '../utils/classes';
import { removeClass                  } from '../utils/classes';
import { makeElementFocusable         } from '../utils/focus-and-click';
import { makeElementNotFocusable      } from '../utils/focus-and-click';
import { makeElementClickable         } from '../utils/focus-and-click';
import { clearFocus                   } from '../utils/focus-and-click';
import { extend                       } from '../utils/uncategorized';
import { forEach                      } from '../utils/uncategorized';



export default class ModalWindow extends Component {
    constructor(element, options) {
        super(element, options);

        this.domCache = extend(this.domCache, {
            openers:     document.querySelectorAll(`[data-modal-opener=${element.getAttribute('id')}]`),
            modalWindow: element.querySelector('.window'),
            closeIcon:   element.querySelector('.closeicon'),
            shadow:      element.querySelector('.mui-shadow-toggle')
        });

        this.state = extend(this.state, {
            isOpened: false,
            savedOpener: null
        });

        this.initAria();
        this.initControls();
        this.initEvents();
    }


    initAria() {
        aria.set(this.domCache.element, 'hidden', true);
        aria.set(this.domCache.shadow,  'hidden', true);

        return this;
    }


    initControls() {
        forEach(this.domCache.openers, (opener) => {
            makeElementClickable(opener, () => {
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
        
        makeElementClickable(this.domCache.closeIcon, this.closeModal.bind(this),
            { mouse: true, keyboard: false });
        makeElementClickable(this.domCache.shadow, this.closeModal.bind(this),
            { mouse: true, keyboard: false });

        TOUCHSCREEN.onPinchOut(this.domCache.modalWindow, this.closeModal.bind(this));

        return this;
    }


    initEvents() {
        EVENTS.addEventListener('scroll-start', () => {
            if (this.state.isOpened) {
                this.closeModal();
                clearFocus();
            }
        });

        return this;
    }


    openModal() {
        if (!this.state.isOpened) {
            addClass(this.domCache.element, '-opened');
            addClass(this.domCache.shadow,  '-visible');
            
            aria.set(this.domCache.element, 'hidden', false);

            makeElementFocusable(this.domCache.modalWindow);
            this.state.isOpened = true;

            this.domCache.modalWindow.focus();
        }

        return this;
    }


    closeModal() {
        if (this.state.isOpened) {
            removeClass(this.domCache.element, '-opened');
            removeClass(this.domCache.shadow,  '-visible');
            
            aria.set(this.domCache.element, 'hidden', true);

            makeElementNotFocusable(this.domCache.modalWindow);
            this.state.isOpened = false;

            if (this.state.savedOpener) {
                this.state.savedOpener.focus();
                this.state.savedOpener = null;
            }
        }

        return this;
    }
}

