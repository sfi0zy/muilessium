// -----------------------------------------------------------------------------
// EVENTS OBSERVER
// -----------------------------------------------------------------------------
//
// Should be available as window.Muilessium.EVENTS,
// take a look at /src/js/muilessium.js if not
//
// Methods:
//   addEvent(name)
//       Creates a new type of events.
//   addEventListener(name, callback, executeIfAlreadyFired = false)
//       Adds event listener to a previously created event type.
//       Can be called if event was fired before listener added (can be useful
//       for some scroll events based on viewport).
//   fireEvent(name)
//       Executes all callbacks for event with this name.
//
// Default events:
//   - resize-window
//   - resize-window-height
//   - resize-window-width
//   - scroll
//   - scroll-start
//   - scroll-end
// Additional events (initialized in /src/js/muilessium.js):
//   - app-initialized
//   - images-loaded
// Additional events (initialized in /src/js/store.js):
//   - store-updated
//
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

