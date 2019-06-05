// -----------------------------------------------------------------------------
// BASE COMPONENT
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

