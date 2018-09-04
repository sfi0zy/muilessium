module.exports = {
    log: {
        error(title, text) {
            console.log('\x1b[31m%s %s\x1b[0m\n  ⇒ %s', '!', title, text);
        },

        warning(title, text) {
            console.log('\x1b[33m%s %s\x1b[0m\n  ⇒ %s', '!', title, text);
        },

        info(title, text) {
            if (text) {
                console.log('\x1b[36m%s %s\x1b[0m\n  ⇒ %s', ' ', title, text);
            } else {
                console.log('\x1b[36m%s %s\x1b[0m', ' ', title);
            }
        }
    }
};

