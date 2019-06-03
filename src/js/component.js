// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------
//
// This is a base component class. All other components from /src/js/components/
// should be inherited from it. Take a look at /src/js/components/sample-component.js
// for more information.
//
// Methods:
//   initAria()
//       ARIA markup should be initialized here. It is useful to use utilities
//       from /src/js/utils/aria.js
//   initControls()
//       Controls (keyboard, mouse or touchscreen) should be initialized here.
//       It is useful to use utilities from /src/js/utils/ and wrappers from
//       /src/js/controls/
//   initEvents()
//       Events should be initialized here.
//   addEvent(...)
//       Should be used to add local event to the component. Collect global
//       events i the global EVENTS object. See /src/js/events.js
//   addEventListener(...)
//       Should be used to subscribe to local event of the component.
//   fireEvent(...)
//       Executes all callbacks for the local event.
//   saveState()
//       Saves the state of the component
//   restoreState()
//       Restores the last saved state
//
// -----------------------------------------------------------------------------


import Stack from './data-types/stack';


export default class Component {
    constructor(element, options) {
        this.domCache = {
            element
        };

        this.state = {};
        this.savedStates = new Stack();

        this.events = {};
    }


    initAria() {
        return this;
    }


    initControls() {
        return this;
    }


    initEvents() {
        return this;
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


    saveState() {
        const currentState = JSON.stringify(this.state);

        this.savedStates.push(currentState);

        return this;
    }


    restoreState() {
        if (!this.savedStates.isEmpty()) {
            const oldState = JSON.parse(this.savedStates.pop());

            this.state = oldState;
        }

        return this;
    }
}

