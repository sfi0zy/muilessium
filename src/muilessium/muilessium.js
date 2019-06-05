// -----------------------------------------------------------------------------
// MUILESSIUM
// -----------------------------------------------------------------------------


import UTILS        from './utils';
import EVENTS       from './events';
import STORE        from './store';
import FACTORY      from './factory';
import DEPENDENCIES from './dependencies';
import POLYFILLS    from './polyfills';
import DATA_TYPES   from './data-types';
import KEYBOARD     from './controls/keyboard';
import MOUSE        from './controls/mouse';
import TOUCHSCREEN  from './controls/touchscreen';


class Muilessium {
    constructor() {
        this.UTILS        = UTILS;
        this.EVENTS       = EVENTS;
        this.STORE        = STORE;
        this.FACTORY      = FACTORY;
        this.DEPENDENCIES = DEPENDENCIES;
        this.POLYFILLS    = POLYFILLS;
        this.DATA_TYPES   = DATA_TYPES;
        this.KEYBOARD     = KEYBOARD;
        this.MOUSE        = MOUSE;
        this.TOUCHSCREEN  = TOUCHSCREEN;

        this.initEvents();
        this.initEventListeners();

        this.EVENTS.fireEvent('muilessium-initialized');
    }


    initEvents() {
        EVENTS.addEvent('muilessium-initialized');
        EVENTS.addEvent('images-loaded');

        return this;
    }


    initEventListeners() {
        EVENTS.addEventListener('muilessium-initialized', () => {
            UTILS.normalizeTabIndex();
            UTILS.initAnchorLinks();
            UTILS.lazyLoadImages(() => {
                EVENTS.fireEvent('images-loaded');
            });

            POLYFILLS.smoothScroll();
        });

        EVENTS.addEventListener('images-loaded', POLYFILLS.objectFit);

        EVENTS.addEventListener('images-loaded', () => {
            if (window.location.hash) {
                const anchor = document.getElementById(window.location.hash.substring(1));

                UTILS.scrollTo(anchor);
            }
        });

        return this;
    }


    get(componentName, id) {
        let result = null;

        UTILS.forEach(this.FACTORY.componentsCache[componentName], (component) => {
            if (component.domCache.element.id === id) {
                result = component;
            }
        });

        return result;
    }
}


// -----------------------------------------------------------------------------


const MUILESSIUM = new Muilessium();

export default MUILESSIUM;

