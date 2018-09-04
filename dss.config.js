module.exports = {
    templatePath: 'src/dss',
    outputPath: 'dist',
    parsers: {
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

        see(i, line) {
            return line;
        },

        depends(i, line) {
            return {
                depends: line
            };
        },

        requires(i, line) {
            return {
                requires: line
            };
        },

        method(i, line) {
            const method = line.split(' - ');

            return {
                name:        method[0] ? method[0] : '',
                description: method[1] ? method[1] : ''
            };
        },

        component(i, line) {
            return line;
        }
    }
};

