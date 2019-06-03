// -----------------------------------------------------------------------------
// TABS COMPONENT
// -----------------------------------------------------------------------------
//
// Methods list:
//  - (default) initAria()
//  - (default) initControls()
//  - (default) restoreState()
//  - makeTabActive(index)
//  - makeTabInactive(index)
//  - goToPreviousTab()
//  - goToNextTab()
//
// -----------------------------------------------------------------------------


import Component from '../component';

import KEYBOARD    from '../controls/keyboard';
import TOUCHSCREEN from '../controls/touchscreen';

import aria from '../utils/aria';

import { addClass                   } from '../utils/classes';
import { removeClass                } from '../utils/classes';
import { makeChildElementsClickable } from '../utils/focus-and-click';
import { makeElementNotFocusable    } from '../utils/focus-and-click';
import { makeElementFocusable       } from '../utils/focus-and-click';
import { extend                     } from '../utils/uncategorized';
import { forEach                    } from '../utils/uncategorized';



export default class Tabs extends Component {
    constructor(element, options) {
        super(element, options);
        
        this.domCache = extend(this.domCache, {
            tabs:          element.querySelectorAll('.tab'),
            labels:        element.querySelectorAll('.label'),
            labelsWrapper: element.querySelector('.labels')
        });

        this.state = extend(this.state, {
            current: 0
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        aria.setRole(this.domCache.labelsWrapper, 'tablist');

        forEach(this.domCache.labels, (label, index) => {
            aria.setRole(label, 'tab');
            aria.set(label, 'selected', false);
            aria.set(label, 'controls', aria.setId(this.domCache.tabs[index]));
        });

        forEach(this.domCache.tabs, (tab, index) => {
            aria.setRole(tab, 'tabpanel');
            aria.set(tab, 'hidden', true);
            aria.set(tab, 'labelledby', aria.setId(this.domCache.labels[index]));
        });

        addClass(this.domCache.tabs[0],   '-active');
        aria.set(this.domCache.tabs[0],   'hidden', false);
        addClass(this.domCache.labels[0], '-active');
        aria.set(this.domCache.labels[0], 'selected', true);
        
        return this;
    }


    initControls() {
        makeChildElementsClickable(this.domCache.element, this.domCache.labels, (index) => {
            this.makeTabInactive(this.state.current);
            this.makeTabActive(index);
        });

        forEach(this.domCache.labels, (label, index) => {
            if (index !== this.state.current) {
                makeElementNotFocusable(label);
            }

            KEYBOARD.onArrowLeftPressed(label, this.goToPreviousTab.bind(this));
            KEYBOARD.onArrowRightPressed(label, this.goToNextTab.bind(this));
        });

        TOUCHSCREEN.onSwipeRight(this.domCache.element, this.goToPreviousTab.bind(this));
        TOUCHSCREEN.onSwipeLeft(this.domCache.element, this.goToNextTab.bind(this));

        return this;
    }


    restoreState() {
        if (!this.savedStates.isEmpty()) {
            const oldState = JSON.parse(this.savedStates.pop());

            this.makeTabInactive(this.state.current);
            this.makeTabActive(oldState.current);
        }

        return this;
    }


    makeTabActive(index) {
        addClass(this.domCache.labels[index], '-active');
        addClass(this.domCache.tabs[index],   '-active');

        aria.set(this.domCache.labels[index], 'selected', true);
        aria.set(this.domCache.tabs[index], 'hidden', false);
        
        makeElementFocusable(this.domCache.labels[index]);
        this.domCache.labels[index].focus();

        this.state.current = index;

        return this;
    }


    makeTabInactive(index) {
        removeClass(this.domCache.labels[index], '-active');
        removeClass(this.domCache.tabs[index],   '-active');

        aria.set(this.domCache.labels[index], 'selected', false);
        aria.set(this.domCache.tabs[index], 'hidden', true);

        this.domCache.labels[index].blur();
        makeElementNotFocusable(this.domCache.labels[index]);

        return this;
    }


    goToPreviousTab() {
        if (this.state.current > 0) {
            this.makeTabInactive(this.state.current);
            this.makeTabActive(this.state.current - 1);
        }

        return this;
    }


    goToNextTab() {
        if (this.state.current < this.domCache.tabs.length - 1) {
            this.makeTabInactive(this.state.current);
            this.makeTabActive(this.state.current + 1);
        }

        return this;
    }
}

