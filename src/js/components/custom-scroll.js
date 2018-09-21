// -----------------------------------------------------------------------------
// CUSTOM SCROLL COMPONENT
// -----------------------------------------------------------------------------

import DEPENDENCIES from '../dependencies';

import Component from '../component';

import { setAttribute } from '../utils/attributes';
import { extend       } from '../utils/uncategorized';

const SimpleBar = DEPENDENCIES.SimpleBar();


export default class CustomScroll extends Component {
    constructor(element, options) {
        super(element, options);

        setAttribute(this.element, 'data-simplebar', '');

        this.state = extend(this.state, {
            simplebar: new SimpleBar(element, {
                classNames: {
                    content: 'content',
                    scrollContent: 'scrollcontent',
                    scrollbar: 'scrollbar',
                    track: 'track'
                }
            })
        });
    }
}

