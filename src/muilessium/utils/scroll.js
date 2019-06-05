// -----------------------------------------------------------------------------
// SCROLL UTILITIES
// -----------------------------------------------------------------------------
//
//  - scrollTo(element, callback)
//  - scrollToTop(callback)
//  - scrollFire(element, callback)
//
// -----------------------------------------------------------------------------


import { ifExists        } from '../utils/checks';
import { isInViewport    } from '../utils/viewport';
import { isAboveViewport } from '../utils/viewport';
import { callOnce        } from '../utils/uncategorized';


// Scroll to element
// -----------------
// Scrolls to the element and executes callback after scroll animation ends

export function scrollTo(element, callback) {
    ifExists(element, () => {
        element.scrollIntoView({ behavior: 'smooth' });

        if (typeof callback === 'function') {
            setTimeout(callback, 470); /* Default scroll time in smoothscroll-polyfill is 468ms */
        }
    });
}



// Scroll to top
// -------------
// Scrolls to the top of page

export function scrollToTop(callback) {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });

    if (typeof callback === 'function') {
        setTimeout(callback, 470); /* Default scroll time in smoothscroll-polyfill is 468ms */
    }
}



// Scrollfire
// ----------
// Executes a callback when the element becomes visible in viewport

export function scrollFire(element, callback) {
    ifExists(element, () => {
        if (typeof callback === 'function') {
            if (isInViewport(element) || isAboveViewport(element)) {
                callback();
            } else {
                const modifiedCallback = callOnce(callback);

                document.addEventListener('scroll', () => {
                    if (isInViewport(element)) {
                        setTimeout(modifiedCallback, 200);
                    }
                });
            }
        }
    });
}


