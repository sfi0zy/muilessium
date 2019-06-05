// -----------------------------------------------------------------------------
// Custom console
// -----------------------------------------------------------------------------


// Log
// ---
// Prints message to the standart browser console

function log(message) {
    window.console.log(`${message}`);
}



// Info
// ----
// Prints info message to the standart browser console

function info(message) {
    window.console.info(`[ INFO ] ${message}`);
}



// Warning
// -------
// Prints warning message to the standart browser console

function warning(message) {
    window.console.warn(`[ WARNING ] ${message}`);
}



// Error
// -----
// Prints error message to the standart browser console

function error(message) {
    window.console.error(`[ ERROR ] ${message}`);
}


// -----------------------------------------------------------------------------

const console = {
    log,
    info,
    warning,
    error
};

export default console;

