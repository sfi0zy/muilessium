// -----------------------------------------------------------------------------
// MOUSE
// -----------------------------------------------------------------------------


function onClick(element, callback) {
    element.addEventListener('click', (e) => {
        e.preventDefault();
        callback(e);
    });
}


function onMove(element, callback) {
    element.addEventListener('mousemove', (e) => {
        e.preventDefault();
        callback(e);
    });
}


function onMouseOver(element, callback) {
    element.addEventListener('mouseover', (e) => {
        e.preventDefault();
        callback(e);
    });
}


function onMouseOut(element, callback) {
    element.addEventListener('mouseout', (e) => {
        e.preventDefault();
        callback(e);
    });
}


// -----------------------------------------------------------------------------


const MOUSE = {
    onClick,
    onMove,
    onMouseOver,
    onMouseOut
};

export default MOUSE;


