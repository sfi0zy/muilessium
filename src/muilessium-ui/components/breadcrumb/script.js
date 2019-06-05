// -----------------------------------------------------------------------------
// BREADCRUMB
// -----------------------------------------------------------------------------


const FACTORY = window.Muilessium.FACTORY;
const _       = window.Muilessium.UTILS;


export default class Breadcrumb extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.initAria();
    }

    initAria() {
        _.aria.setRole(this.domCache.element, 'navigation');

        return this;
    }
}
 
