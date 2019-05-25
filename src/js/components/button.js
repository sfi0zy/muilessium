// -----------------------------------------------------------------------------
// BUTTON COMPONENT
// -----------------------------------------------------------------------------
//
// Methods list:
//  - (default) initAria()
//
// -----------------------------------------------------------------------------


import Component from '../component';

import aria from '../utils/aria';



export default class Button extends Component {
    constructor(element, options) {
        super(element, options);
        
        this.initAria();
        this.initEvents();
    }


    initAria() {
        if (!aria.getRole(this.domCache.element)) {
            /* Sometimes it is useful to add role=link to the button,
               we should not override it here */
            aria.setRole(this.domCache.element, 'button');
        }

        return this;
    }


    initEvents() {
        this.addEvent('click');

        this.domCache.element.addEventListener('click',
            this.fireEvent.bind(this, 'click'));
    }
}

