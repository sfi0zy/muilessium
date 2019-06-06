// -----------------------------------------------------------------------------
// TOUCHSCREEN
// -----------------------------------------------------------------------------


import DEPENDENCIES from '../dependencies';

const Hammer = DEPENDENCIES.Hammer();


function onSwipeLeft(element, callback) {
    const hammertime = new Hammer(element);

    hammertime.on('swipeleft', callback);
}


function onSwipeRight(element, callback) {
    const hammertime = new Hammer(element);

    hammertime.on('swiperight', callback);
}


function onSwipeUp(element, callback) {
    const hammertime = new Hammer(element);

    hammertime.get('swipe').set({
        direction: Hammer.DIRECTION_VERTICAL
    });

    hammertime.on('swipeup', callback);
}


function onSwipeDown(element, callback) {
    const hammertime = new Hammer(element);

    hammertime.get('swipe').set({
        direction: Hammer.DIRECTION_VERTICAL
    });

    hammertime.on('swipedown', callback);
}


function onPinchOut(element, callback) {
    const hammertime = new Hammer(element);

    hammertime.get('pinch').set({ enable: true });
    hammertime.on('pinchout', callback);
}


// -----------------------------------------------------------------------------


const TOUCHSCREEN = {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinchOut
};

export default TOUCHSCREEN;

