const fs         = require('fs');
const dss        = require('dss');
const pug        = require('pug');
const path       = require('path');
const File       = require('gulp-util').File;
const through    = require('through');



module.exports = function gulpDSS(options) {
    const files = [];
    const template = fs.readFileSync(`${options.templatePath}/index.pug`, 'utf-8');

    Object.keys(options.parsers).forEach((key) => {
        dss.parser(key, options.parsers[key]);
    });

    function process(file) {
        dss.parse(file.contents.toString(), {}, (parsed) => {
            parsed.file = path.relative('.', file.path);

            if (parsed.blocks) {
                parsed.blocks.forEach((block) => {
                    if (block.markup) {
                        block.markup.compiled = pug.render(block.markup.example, {
                            pretty: true
                        });
                    }
                });
            }

            files.push(parsed);
        });
    }

    function end() {
        const html = pug.render(template, {
            pkg: options.pkg,
            files
        });

        this.emit('data', new File({
            path: 'index.html',
            contents: Buffer.from(html, 'utf-8')
        }));

        this.emit('end');
    }

    return through(process, end);
};

