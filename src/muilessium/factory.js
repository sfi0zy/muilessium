// -----------------------------------------------------------------------------
// FACTORY OF COMPONENTS
// -----------------------------------------------------------------------------


import BaseComponent from './base-component';


class Factory {
    constructor() {
        this.BaseComponent = BaseComponent;
        this.components = {};
        this.componentsCache = {};
    }


    registerComponent(type, component) {
        if (!this.components[type]) {
            this.components[type] = component;
        }
    }


    create(type, selector, options) {
        if (typeof this.components[type] !== 'function') {
            throw new Error(`No such component: ${type}`);
        }

        if (!this.componentsCache[type]) {
            this.componentsCache[type] = [];
        }

        const elements = document.querySelectorAll(selector);

        return [].map.call(elements, (element) => {
            const newComponent = new this.components[type](element, options);

            this.componentsCache[type].push(newComponent);

            return newComponent;
        });
    }
}


// -----------------------------------------------------------------------------


const FACTORY = new Factory();

export default FACTORY;

