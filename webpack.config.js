// -----------------------------------------------------------------------------
//  CONFIG: WEBPACK
// -----------------------------------------------------------------------------
//
//  We use webpack for scripts only. This is not a popular choise, usually
//  people use it to pack everything in one bundle, but we use the old-school
//  approach where HTML, CSS and JS are separated, so we don't need to put
//  them all in the one box.
//
//  See https://webpack.js.org/ for more information.
//


const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


module.exports = {

    // -------------------------------------------------------------------------
    //  Development
    // -------------------------------------------------------------------------

    development: {
        devtool: 'eval',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env']
                        }
                    }
                }
            ]
        }
    },

    // -------------------------------------------------------------------------
    //  Production
    // -------------------------------------------------------------------------

    production: {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env']
                        }
                    }
                }
            ]
        },
        plugins: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    output: {
                        comments: false
                    }
                }
            })
        ]
    }
};

