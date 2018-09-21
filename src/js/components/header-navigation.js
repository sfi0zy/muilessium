// -----------------------------------------------------------------------------
// HEADER NAVIGATION COMPONENT
// -----------------------------------------------------------------------------
//
// Methods list:
//  - (default) initAria()
//  - (default) initControls()
//  - openNavigation()
//  - closeNavigation()
//  - toggleNavigation()
//  - transformToMobile()
//  - transformToDesktop()
//  - update()
//
// -----------------------------------------------------------------------------


import Component from '../component';

import EVENTS from '../events';

import TOUCHSCREEN from '../controls/touchscreen';
import KEYBOARD    from '../controls/keyboard';

import aria from '../utils/aria';

import { addClass                     } from '../utils/classes';
import { removeClass                  } from '../utils/classes';
import { getFocusableChilds           } from '../utils/focus-and-click';
import { makeElementClickable         } from '../utils/focus-and-click';
import { makeChildElementsClickable   } from '../utils/focus-and-click';
import { goToPreviousFocusableElement } from '../utils/focus-and-click';
import { goToNextFocusableElement     } from '../utils/focus-and-click';
import { extend                       } from '../utils/uncategorized';
import { forEach                      } from '../utils/uncategorized';
import { firstOfList                  } from '../utils/uncategorized';
import { lastOfList                   } from '../utils/uncategorized';



export default class HeaderNavigation extends Component {
    constructor(element, options) {
        super(element, options);
        
        this.domCache = extend(this.domCache, {
            hamburger:  element.querySelector('.mui-navigation-toggle'),
            shadow:     element.querySelector('.mui-shadow-toggle'),
            linksList:  element.querySelector('.linkslist'),
            links:      element.querySelectorAll('.link'),
            focusables: []
        });

        this.state = extend(this.state, {
            opened: false,
            mobile: false
        });

        this.initAria();
        this.initControls();
        this.update();

        EVENTS.addEventListener('resize-window-width', this.update.bind(this)); 

        this.state.initialized = true;
    }


    initAria() {
        aria.setRole(this.domCache.hamburger, 'button');

        aria.set(this.domCache.shadow,    'hidden', true);
        aria.set(this.domCache.hamburger, 'haspopup', true);

        aria.set(this.domCache.linksList, 'labelledby', aria.setId(this.domCache.hamburger));

        return this;
    }


    initControls() {
        makeElementClickable(this.domCache.hamburger, this.toggleNavigation.bind(this));
        makeElementClickable(this.domCache.shadow,    this.toggleNavigation.bind(this),
            { mouse: true, keyboard: false });

        makeChildElementsClickable(this.domCache.element, this.domCache.links, (index) => {
            const href = this.domCache.links[index].getAttribute('href');

            if (href[0] === '#') {
                this.closeNavigation();
            } else {
                window.location = href;
            }
        });

        TOUCHSCREEN.onSwipeRight(this.domCache.element, () => {
            if (this.state.mobile) {
                this.closeNavigation();
            }
        });

        this.domCache.focusables = getFocusableChilds(this.domCache.linksList);

        KEYBOARD.onShiftTabPressed(firstOfList(this.domCache.focusables), () => {
            this.closeNavigation();

            goToPreviousFocusableElement(this.domCache.hamburger);
        });

        KEYBOARD.onTabPressed(lastOfList(this.domCache.focusables), () => {
            this.closeNavigation();

            goToNextFocusableElement(
                lastOfList(this.domCache.focusables));
        });

        return this;
    }


    openNavigation() {
        if (!this.state.opened) {
            this.state.opened = true;
            this.domCache.shadow.tabIndex = 0;

            addClass(this.domCache.element, '-opened');
            addClass(this.domCache.shadow,  '-visible');

            aria.set(this.domCache.hamburger, 'hidden', true);
            aria.set(this.domCache.linksList, 'hidden', false);

            firstOfList(this.domCache.focusables).focus();
        }

        return this;
    }


    closeNavigation() {
        if (this.state.opened) {
            this.state.opened = false;
            this.domCache.shadow.tabIndex = -1;

            removeClass(this.domCache.element, '-opened');
            removeClass(this.domCache.shadow,  '-visible');

            aria.set(this.domCache.hamburger, 'hidden', false);
            aria.set(this.domCache.linksList, 'hidden', true);

            this.domCache.hamburger.focus();
        }

        return this;
    }
    
    toggleNavigation() {
        if (this.state.opened) {
            this.closeNavigation();
        } else {
            this.openNavigation();
        }

        return this;
    }


    transformToMobile() {
        if (!this.state.mobile || !this.state.initialized) {
            this.closeNavigation();

            aria.set(this.domCache.hamburger, 'hidden', false);
            aria.set(this.domCache.linksList, 'hidden', true);

            addClass(this.domCache.element, '-mobile-version');
            removeClass(this.domCache.element, '-desktop-version');

            this.state.mobile = true;
        }

        return this;
    }


    transformToDesktop() {
        if (this.state.mobile || !this.state.initialized) {
            this.closeNavigation();

            aria.set(this.domCache.hamburger, 'hidden', true);
            aria.set(this.domCache.shadow,    'hidden', true);
            aria.set(this.domCache.linksList, 'hidden', false);

            addClass(this.domCache.element, '-desktop-version');
            removeClass(this.domCache.element, '-mobile-version');

            this.state.mobile = false;
        }

        return this;
    }


    update() {
        if (window.innerWidth < 600) {
            this.transformToMobile();
            return this;
        }

        this.transformToDesktop();

        const { parentNode } = this.domCache.element;
        const parentWidth = parentNode.clientWidth;

        let childsWidth = 0;

        forEach(parentNode.childNodes, (child) => {
            const width = child.offsetWidth;

            if (width) {
                childsWidth += child.offsetWidth;
            }
        });
 
        if (childsWidth > (parentWidth - 50)) {
            this.transformToMobile();
        } else {
            this.transformToDesktop();
        }

        return this;
    }
}

