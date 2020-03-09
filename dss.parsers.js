// -----------------------------------------------------------------------------
//  PARSERS FOR DSS
// -----------------------------------------------------------------------------
//
//  We use the "dss" npm package for building documentation for UI components.
//
//  It's not a very popular tool and it seems like this package was published
//  about 6 years ago. We use it here because it's a very simple tool.
//  It's small and it works. Like old programs in *nix. We don't need to
//  improve it endlessly and add more functions.
//
//  See https://www.npmjs.com/package/dss for more information.


module.exports =  {
    link(i, line) {
        const exp = new RegExp('(b(https?|ftp|file)://[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])', 'ig');

        line.replace(exp, '<a href="$1">$1</a>');
        return line;
    },


    lvar(i, line) {
        const lvar = line.split(' - ');

        return {
            name:        lvar[0] ? lvar[0] : '',
            defaults:    lvar[1] ? lvar[1] : '',
            description: lvar[2] ? lvar[2] : ''
        };
    },


    description_ru(i, line) {
        return line;
    },


    see(i, line) {
        return line;
    },


    event(i, line) {
        return line;
    },


    requires(i, line) {
        return line;
    },


    method(i, line) {
        const method = line.split(' - ');

        return {
            name:           method[0] ? method[0] : '',
            description:    method[1] ? method[1] : '',
            description_ru: method[2] ? method[2] : ''
        };
    },


    component(i, line) {
        return line;
    }
};

