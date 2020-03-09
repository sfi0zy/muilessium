// -----------------------------------------------------------------------------
// BUTTON
// -----------------------------------------------------------------------------


const FACTORY = window.Muilessium.FACTORY;
const _       = window.Muilessium.UTILS;


export default class Button extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.initAria();
        this.initEvents();
    }


    initAria() {
        if (!_.aria.getRole(this.domCache.element)) {
            /* Sometimes it is useful to add role=link to the button,
               we should not override it here */
            _.aria.setRole(this.domCache.element, 'button');
        }

        return this;
    }


    initEvents() {
        this.addEvent('click');

        this.domCache.element.addEventListener('click',
            this.fireEvent.bind(this, 'click'));
    }
}

