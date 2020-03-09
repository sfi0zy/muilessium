// -----------------------------------------------------------------------------
//  GULP W3C VALIDATE
// -----------------------------------------------------------------------------
//
//  This plugin validates html using the W3C validator.
//
//  See more information about W3C API here:
//  https://validator.w3.org/docs/api.html
//


const path    = require('path');
const through = require('through');
const w3cjs   = require('w3cjs');


require('colors');


module.exports = function validate() {
    function process(file) {
        const filename = path.relative('.', file.path);

        w3cjs.validate({
            input: file.contents,
            callback: (error, result) => {
                result.messages.forEach((message) => {
                    switch (message.type) {
                        case 'info': {
                            if (message.subType === 'warning') {
                                console.log('W3C [info]:'.yellow);
                                console.log(`${filename}: line ${message.lastLine}:`.yellow);
                                console.log(message.message.yellow);
                            } else {
                                console.log('W3C [info]:'.blue);
                                console.log(`${filename}: line ${message.lastLine}:`.blue);
                                console.log(message.message.blue);
                            }
                            break;
                        }
                        case 'error': {
                            console.log('W3C [error]:'.red);
                            console.log(`${filename}: line ${message.lastLine}:`.red);
                            console.log(message.message.red);
                            break;
                        }
                        default: {
                            console.log('W3C:'.magenta);
                            console.log(`${filename}: line ${message.lastLine}:`.magenta);
                            console.log(message.message.magenta);
                            break;
                        }
                    }

                    console.log(message.extract);
                    console.log('\n');
                });
            }
        });
    }


    function end() {
        this.emit('end');
    }


    return through(process, end);
};

