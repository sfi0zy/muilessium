require('colors');


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
            console.log('\n\n');

            list.simpleSelectors.ids.forEach((id) => {
                console.log(`${'ID'.red}:\n\n    ${id} {\n        . . .\n    }`);
            });

            console.log('\n');
        }),
        require('doiuse')(require('./doiuse.config.js')),
        require('cssnano')({
            preset: ['default', {
                discardComments: {
                    removeAll: true
                }
            }]
        })
    ]
};

