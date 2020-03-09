// -----------------------------------------------------------------------------
// EVENTS OBSERVER
// -----------------------------------------------------------------------------


class Events {
    constructor() {
        this.state = {
            window: {}
        };

        this.timeouts = {

        };

        this.events = {};

        this.initDefaultEvents();
    }


    initDefaultEvents() {
        this.initWindowResizeEvents();
        this.initScrollEvents();
    }


    initWindowResizeEvents() {
        this.addEvent('resize-window');
        this.addEvent('resize-window-height');
        this.addEvent('resize-window-width');

        this.state.window.height = window.innerHeight;
        this.state.window.width  = window.innerWidth;

        this.timeouts.resizeWindow       = null;

        window.addEventListener('resize', () => {
            this.fireEvent('resize-window');

            const height = window.innerHeight;
            const width  = window.innerWidth;

            if (this.state.window.height !== height) {
                this.state.window.height = height;
                this.fireEvent('resize-window-height');
            }

            if (this.state.window.width !== width) {
                this.state.window.width = width;
                this.fireEvent('resize-window-width');
            }
        });
    }


    initScrollEvents() {
        this.addEvent('scroll');
        this.addEvent('scroll-start');
        this.addEvent('scroll-end');

        this.timeouts.scroll = null;

        window.addEventListener('scroll', () => {
            this.fireEvent('scroll');

            if (!this.timeouts.scroll) {
                this.fireEvent('scroll-start');
            } else {
                clearTimeout(this.timeouts.scroll);
            }

            this.timeouts.scroll = setTimeout(() => {
                this.fireEvent('scroll-end');
                this.timeouts.scroll = null;
            }, 150);
        });
    }


    addEvent(name) {
        if (!(name in this.events)) {
            this.events[name] = {
                callbacks: [],
                counter: 0
            };
        }

        return this;
    }


    addEventListener(name, callback, executeIfAlreadyFired = false) {
        if ((name in this.events) && (typeof callback === 'function')) {
            this.events[name].callbacks.push(callback);

            if (executeIfAlreadyFired && (this.events[name].counter > 0)) {
                callback();
            }
        }

        return this;
    }


    fireEvent(name) {
        if (name in this.events) {
            this.events[name].counter++;

            this.events[name].callbacks.forEach((callback) => {
                if (typeof callback === 'function') {
                    callback(this.state);
                }
            });
        }

        return this;
    }
}


// -----------------------------------------------------------------------------


const EVENTS = new Events();

export default EVENTS;

