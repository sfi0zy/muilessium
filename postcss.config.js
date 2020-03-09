// -----------------------------------------------------------------------------
//  CONFIG: POSTCSS
// -----------------------------------------------------------------------------
//
//  We use PostCSS after the LESS preprocessor. In other words, we use
//  LESS syntax and run PostCSS after it to check the CSS we got.
//
//  See https://postcss.org/ for more information.
//


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

