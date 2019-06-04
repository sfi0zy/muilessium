module.exports = {
    plugins: [
        require('postcss-preset-env')({
            warnForDuplicates: false,
            features: {
                rem: {
                    html: false
                },
                calc: false
            }
        }),
        require('postcss-fixes')({ preset: 'safe' }),
        require('list-selectors').plugin((list) => {
            const inspect = require('util').inspect;

            console.log('\x1b[36m');
            console.log('SELECTORS:');
            console.log(inspect(list.selectors, { maxArrayLength: null }));
            console.log('\x1b[31m');
            console.log('IDS:');
            console.log(inspect(list.simpleSelectors.ids, { maxArrayLength: null }));
            console.log('\x1b[0m');
        }),
        require('doiuse')(require('./doiuse.config.js')),
        require('cssnano')({
            discardComments: {
                removeAll: true
            }
        })
    ]
};

