require('colors');


module.exports = {
    log: {
        error(title, text) {
            if (text) {
                console.log(`${'%s %s'.red}\n  ⇒ %s`, '!', title, text);
            } else {
                console.log(`${'%s %s'.red}\n`, '!', title);
            }
        },

        warning(title, text) {
            if (text) {
                console.log(`${'%s %s'.yellow}\n  ⇒ %s`, '!', title, text);
            } else {
                console.log(`${'%s %s'.yellow}\n`, '!', title);
            }
        },

        info(title, text) {
            if (text) {
                console.log(`${'%s %s'.blue}\n  ⇒ %s`, ' ', title, text);
            } else {
                console.log(`${'%s %s'.blue}`, ' ', title);
            }
        }
    }
};

