// -----------------------------------------------------------------------------
// KEYBOARD
// -----------------------------------------------------------------------------


function onEnterPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            callback(e);
        }
    });
}


function onSpacePressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode === 32) {
            e.preventDefault();
            callback(e);
        }
    });
}


function onTabPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode === 9 && !e.shiftKey) {
            e.preventDefault();
            callback(e);
        }
    });
}


function onEscapePressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode === 27 && !e.shiftKey) {
            e.preventDefault();
            callback(e);
        }
    });
}


function onShiftTabPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode === 9 && e.shiftKey) {
            e.preventDefault();
            callback(e);
        }
    });
}


function onArrowLeftPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode === 37) {
            e.preventDefault();
            callback(e);
        }
    });
}


function onArrowUpPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode === 38) {
            e.preventDefault();
            callback(e);
        }
    });
}


function onArrowRightPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode === 39) {
            e.preventDefault();
            callback(e);
        }
    });
}


function onArrowDownPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode === 40) {
            e.preventDefault();
            callback(e);
        }
    });
}


// -----------------------------------------------------------------------------


const KEYBOARD = {
    onEnterPressed,
    onSpacePressed,
    onTabPressed,
    onEscapePressed,
    onShiftTabPressed,
    onArrowUpPressed,
    onArrowRightPressed,
    onArrowDownPressed,
    onArrowLeftPressed
};

export default KEYBOARD;

