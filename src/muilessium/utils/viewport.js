// -----------------------------------------------------------------------------
// Viewport utilities
// -----------------------------------------------------------------------------


import { ifExists } from '../utils/checks';


// Is in viewport
// --------------
// Returns true if the element is in viewport

export function isInViewport(element) {
    return ifExists(element, () => {
        const rect = element.getBoundingClientRect();
        const html = document.documentElement;

        return (
            rect.top    >= 0 &&
            rect.left   >= 0 &&
            rect.bottom <= (window.innerHeight || html.clientHeight) &&
            rect.right  <= (window.innerWidth  || html.clientWidth)
        );
    });
}


// Is above viewport
// -----------------
// Returns true if the element is above viewport

export function isAboveViewport(element) {
    return ifExists(element, () => {
        return (
            element.offsetTop + element.offsetHeight < window.pageYOffset
        );
    });
}


