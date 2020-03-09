// -----------------------------------------------------------------------------
// SCROLL
// -----------------------------------------------------------------------------


const FACTORY     = window.Muilessium.FACTORY;
const EVENTS      = window.Muilessium.EVENTS;
const _           = window.Muilessium.UTILS;


export default class ScrollFix extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.initAria();
        this.initEvents();
    }

    initAria() {
        _.aria.setRole(this.domCache.element, 'presentation');

        return this;
    }

    initEvents() {
        EVENTS.addEventListener('scroll-start', () => {
            _.addClass(this.domCache.element, '-active');
        });

        EVENTS.addEventListener('scroll-end', () => {
            setTimeout(() => {
                _.removeClass(this.domCache.element, '-active');
            }, 300);
        });
    }
}

