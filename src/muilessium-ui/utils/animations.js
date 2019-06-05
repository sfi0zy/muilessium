// -----------------------------------------------------------------------------
// ANIMATIONS
// -----------------------------------------------------------------------------


const _ = window.Muilessium.UTILS;


// Activate animation
// ------------------
// Activates mui-js-animation from src/less/animations.less

export function activateAnimation(element) {
    _.ifExists(element, () => {
        _.addClass(element, '-activated');
    });
}


// Animate element
// ---------------
// Animates element with selected animation from src/less/animations.less

export function animateElement(element, animation) {
    _.ifExists(element, () => {
        _.addClass(element, '-js-animation');

        _.forEach([
            '-fade-in',  '-fade-in-left',  '-fade-in-up',  '-fade-in-right',  '-fade-in-down',
            '-fade-out', '-fade-out-left', '-fade-out-up', '-fade-out-right', '-fade-out-down'], (name) => {
            if (_.hasClass(element, name)) {
                _.removeClass(element, name);
            }
        });

        _.addClass(element, `-${animation}`);
        _.addClass(element, '-activated');
    });
}

