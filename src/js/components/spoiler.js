// -----------------------------------------------------------------------------
// SPOILER COMPONENT
// -----------------------------------------------------------------------------
//
// Methods list:
//  - (default) initAria()
//  - (default) initControls()
//  - (default) restoreState()
//  - open()
//  - close()
//  - toggle()
//
// -----------------------------------------------------------------------------


import Component from '../component';

import aria from '../utils/aria';

import { addClass             } from '../utils/classes';
import { toggleClass          } from '../utils/classes';
import { removeClass          } from '../utils/classes';
import { makeElementClickable } from '../utils/focus-and-click';
import { extend               } from '../utils/uncategorized';


export default class Spoiler extends Component {
    constructor(element, options) {
        super(element, options);

        this.domCache = extend(this.domCache, {
            title:   element.querySelector('.title'),
            content: element.querySelector('.content')
        });

        this.state = extend(this.state, {
            isOpened: false
        });

        this.initAria();
        this.initControls();
    }


    initAria() {        
        aria.setRole(this.domCache.element, 'tablist');
        
        aria.setRole(this.domCache.title, 'tab');
        aria.set(this.domCache.title, 'expanded', false);
        aria.set(this.domCache.title, 'controls', aria.setId(this.domCache.content));

        aria.setRole(this.domCache.content, 'tabpanel');
        aria.set(this.domCache.content, 'hidden', true);
        aria.set(this.domCache.content, 'labelledby', aria.setId(this.domCache.title));

        return this;
    }


    initControls() {
        makeElementClickable(this.domCache.title, this.toggle.bind(this));

        return this;
    }


    restoreState() {
        if (!this.savedStates.isEmpty()) {
            const oldState = JSON.parse(this.savedStates.pop());

            if (oldState.isOpened) {
                this.open();
            } else {
                this.close();
            }
        }

        return this;
    }


    open() {
        addClass(this.domCache.element, '-opened');

        aria.set(this.domCache.title,   'expanded', false);
        aria.set(this.domCache.content, 'hidden',   true);

        this.state.isOpened = true;

        return this;
    }


    toggle() {
        toggleClass(this.domCache.element, '-opened');

        aria.toggleState(this.domCache.title,   'expanded');
        aria.toggleState(this.domCache.content, 'hidden');

        this.state.isOpened = !this.state.isOpened;

        return this;
    }


    close() {
        removeClass(this.domCache.element, '-opened');

        aria.set(this.domCache.title,   'expanded', true);
        aria.set(this.domCache.content, 'hidden',   false);

        this.state.isOpened = false;

        return this;
    }
}

