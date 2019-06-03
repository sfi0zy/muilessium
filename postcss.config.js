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
        require('doiuse')(require('./doiuse.config.js')),
        require('cssnano')({
            discardComments: {
                removeAll: true
            }
        })
    ]
};

