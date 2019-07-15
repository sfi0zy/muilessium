// -----------------------------------------------------------------------------
// HEADER NAVIGATION
// -----------------------------------------------------------------------------


const FACTORY     = window.Muilessium.FACTORY;
const EVENTS      = window.Muilessium.EVENTS;
const TOUCHSCREEN = window.Muilessium.TOUCHSCREEN;
const KEYBOARD    = window.Muilessium.KEYBOARD;
const _           = window.Muilessium.UTILS;


export default class HeaderNavigation extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);
        
        this.domCache = _.extend(this.domCache, {
            hamburger:  element.querySelector('.mui-navigation-toggle'),
            shadow:     element.querySelector('.mui-shadow-toggle'),
            linksList:  element.querySelector('.linkslist'),
            links:      element.querySelectorAll('.link'),
            focusables: []
        });

        this.state = _.extend(this.state, {
            opened: false,
            mobile: false
        });

        this.initAria();
        this.initControls();
        this.update();
        this.initEvents();

        setTimeout(() => {
            _.addClass(this.domCache.element, '-activated');
        }, 500);

        this.state.initialized = true;
    }


    initAria() {
        _.aria.setRole(this.domCache.hamburger, 'button');

        _.aria.set(this.domCache.shadow,    'hidden', true);
        _.aria.set(this.domCache.hamburger, 'haspopup', true);

        _.aria.set(this.domCache.linksList, 'labelledby', _.aria.setId(this.domCache.hamburger));

        return this;
    }


    initControls() {
        _.makeElementClickable(this.domCache.hamburger, this.toggleNavigation.bind(this));
        _.makeElementClickable(this.domCache.shadow,    this.toggleNavigation.bind(this),
            { mouse: true, keyboard: false });

        _.makeChildElementsClickable(this.domCache.element, this.domCache.links, (index) => {
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

        this.domCache.focusables = _.getFocusableChilds(this.domCache.linksList);

        KEYBOARD.onShiftTabPressed(_.firstOfList(this.domCache.focusables), () => {
            this.closeNavigation();

            _.goToPreviousFocusableElement(this.domCache.hamburger);
        });

        KEYBOARD.onTabPressed(_.lastOfList(this.domCache.focusables), () => {
            this.closeNavigation();

            _.goToNextFocusableElement(
                _.lastOfList(this.domCache.focusables));
        });

        return this;
    }


    initEvents() {
        EVENTS.addEventListener('resize-window-width', this.update.bind(this)); 

        EVENTS.addEventListener('scroll-start', () => {
            this.closeNavigation();
            _.clearFocus();
        });

        this.addEvent('open-navigation');
        this.addEvent('close-navigation');

        return this;
    }


    restoreState() {
        if (!this.savedStates.isEmpty()) {
            const oldState = JSON.parse(this.savedStates.pop());

            if (oldState.opened) {
                this.openNavigation();
            } else {
                this.closeNavigation();
            }
        }

        return this;
    }


    openNavigation() {
        if (!this.state.opened) {
            this.state.opened = true;
            this.domCache.shadow.tabIndex = 0;

            _.addClass(this.domCache.element, '-opened');
            _.addClass(this.domCache.shadow,  '-visible');

            _.aria.set(this.domCache.hamburger, 'hidden', true);
            _.aria.set(this.domCache.linksList, 'hidden', false);

            _.firstOfList(this.domCache.focusables).focus();

            this.fireEvent('open-navigation');
        }

        return this;
    }


    closeNavigation() {
        if (this.state.opened) {
            this.state.opened = false;
            this.domCache.shadow.tabIndex = -1;

            _.removeClass(this.domCache.element, '-opened');
            _.removeClass(this.domCache.shadow,  '-visible');

            _.aria.set(this.domCache.hamburger, 'hidden', false);
            _.aria.set(this.domCache.linksList, 'hidden', true);

            this.domCache.hamburger.focus();

            this.fireEvent('close-navigation');
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

            _.aria.set(this.domCache.hamburger, 'hidden', false);
            _.aria.set(this.domCache.linksList, 'hidden', true);

            _.addClass(this.domCache.element, '-mobile-version');
            _.removeClass(this.domCache.element, '-desktop-version');

            this.state.mobile = true;
        }

        return this;
    }


    transformToDesktop() {
        if (this.state.mobile || !this.state.initialized) {
            this.closeNavigation();

            _.aria.set(this.domCache.hamburger, 'hidden', true);
            _.aria.set(this.domCache.shadow,    'hidden', true);
            _.aria.set(this.domCache.linksList, 'hidden', false);

            _.addClass(this.domCache.element, '-desktop-version');
            _.removeClass(this.domCache.element, '-mobile-version');

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

        _.forEach(parentNode.childNodes, (child) => {
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

