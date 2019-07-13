const gulp         = require('gulp');
const $            = require('gulp-load-plugins')();
const fs           = require('fs');
const path         = require('path');
const argv         = require('yargs').argv;
const webpack      = require('webpack-stream');
const browserSync  = require('browser-sync').create();
const dss          = require('./gulp-dss.js');



require('colors');



const pkg         = JSON.parse(fs.readFileSync('./package.json'));
const ENVIRONMENT = argv.production ? 'production' : 'development';



console.log(`${(new Date()).toString().white}\n`);
console.log(`> ${argv.$0} ${argv._}`);
console.log(ENVIRONMENT.toUpperCase().yellow);
console.log(`${pkg.name.red} ${pkg.version.green}\n`);
console.log('%s\n'.blue, pkg.browserslist);

let isDependenciesSaved = true;

console.log('DEPENDENCIES:');

Object.keys(pkg.dependencies).forEach((dependency) => {
    const depPackage =
        JSON.parse(
            fs.readFileSync(
                path.join('node_modules', dependency, 'package.json'), 'utf-8'));

    if (depPackage._requested.registry) {
        if (depPackage.version !== pkg.dependencies[dependency]) {
            console.log('NPM %s@%s'.green, dependency, depPackage.version.red);
            isDependenciesSaved = false;
        } else {
            console.log('NPM %s@%s'.green, dependency, depPackage.version);
        }
    } else {
        if (depPackage._resolved !== pkg.dependencies[dependency]) {
            console.log('--- %s@%s'.blue, dependency, depPackage._resolved.red);
            isDependenciesSaved = false;
        } else {
            console.log('--- %s@%s'.blue, dependency, depPackage._resolved);
        }
    }
});

console.log('\nDEV DEPENDENCIES:');

Object.keys(pkg.devDependencies).forEach((dependency) => {
    const depPackage =
        JSON.parse(
            fs.readFileSync(
                path.join('node_modules', dependency, 'package.json'), 'utf-8'));

    if (depPackage._requested.registry) {
        if (depPackage.version !== pkg.devDependencies[dependency]) {
            console.log('NPM %s@%s'.green, dependency, depPackage.version.red);
            isDependenciesSaved = false;
        } else {
            console.log('NPM %s@%s'.green, dependency, depPackage.version);
        }
    } else {
        if (depPackage._resolved !== pkg.devDependencies[dependency]) {
            console.log('--- %s@%s'.blue, dependency, depPackage._resolved.red);
            isDependenciesSaved = false;
        } else {
            console.log('--- %s@%s'.blue, dependency, depPackage._resolved);
        }
    }
});

if (!isDependenciesSaved) {
    console.log('Dependencies in the package.json are not saved correctly.'.red);
    console.log('Run `npm run save-installed` to fix it.'.red);
}

console.log('\n\n\n');



// -----------------------------------------------------------------------------



gulp.task('muilessium:lint-js', () => {
    return gulp.src('./src/muilessium/**/*.js')
        .pipe($.eslint())
        .pipe($.eslint.format());
});


gulp.task('muilessium:test-js', () => {
    return gulp.src('./src/muilessium/tests/utils/*.js')
        .pipe($.nodeunit());
});


gulp.task('muilessium:compile-js', () => {
    return gulp.src('./src/muilessium/main.js')
        .pipe(webpack(require('./webpack.config.js')[ENVIRONMENT]))
        .pipe($.rename('muilessium.min.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});


gulp.task('muilessium', gulp.series(
    'muilessium:lint-js',
    'muilessium:test-js',
    'muilessium:compile-js'
));



// -----------------------------------------------------------------------------



gulp.task('muilessium-ui:lint-js', () => {
    return gulp.src('./src/muilessium-ui/**/*.js')
        .pipe($.eslint())
        .pipe($.eslint.format());
});


gulp.task('muilessium-ui:compile-js', () => {
    return gulp.src('./src/muilessium-ui/main.js')
        .pipe(webpack(require('./webpack.config.js')[ENVIRONMENT]))
        .pipe($.rename('muilessium-ui.min.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});


gulp.task('muilessium-ui:compile-less', () => {
    return gulp.src('./src/muilessium-ui/main.less')
        .pipe($.if(ENVIRONMENT === 'development', $.sourcemaps.init()))
        .pipe($.less())
        .pipe($.postcss())
        .pipe($.if(ENVIRONMENT === 'development', $.sourcemaps.write()))
        .pipe($.rename('muilessium-ui.min.css'))
        .pipe($.size({ showFiles: true }))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});



gulp.task('muilessium-ui', gulp.series(
    'muilessium-ui:lint-js',
    'muilessium-ui:compile-js',
    'muilessium-ui:compile-less'
));



// -----------------------------------------------------------------------------



gulp.task('docs:main', () => {
    return gulp.src('./src/muilessium-ui/components/**/*.less')
        .pipe(dss({
            pkg,
            templatePath: './src/docs',
            parsers: require('./dss.parsers.js'),
            outputPath: './dist'
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});


gulp.task('docs:muilessium', () => {
    return gulp.src('./src/muilessium-ui/components/**/*.less')
        .pipe(dss({
            pkg,
            templatePath: './src/docs/muilessium',
            parsers: require('./dss.parsers.js'),
            outputPath: './dist/muilessium'
        }))
        .pipe(gulp.dest('./dist/muilessium'))
        .pipe(browserSync.stream());
});


gulp.task('docs:muilessium-ui', () => {
    return gulp.src('./src/muilessium-ui/components/**/*.less')
        .pipe(dss({
            pkg,
            templatePath: './src/docs/muilessium-ui',
            parsers: require('./dss.parsers.js'),
            outputPath: './dist/muilessium-ui'
        }))
        .pipe(gulp.dest('./dist/muilessium-ui'))
        .pipe(browserSync.stream());
});


gulp.task('docs', gulp.series(
    'docs:main',
    'docs:muilessium',
    'docs:muilessium-ui',
));



// -----------------------------------------------------------------------------



gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './dist'
        },
        files: ['./src/**']
    });

    gulp.watch([
        './src/muilessium/**/*.js',
    ], gulp.series('muilessium:compile-js'));

    gulp.watch([
        './src/muilessium-ui/**/*.js',
    ], gulp.series('muilessium-ui:compile-js'));

    gulp.watch([
        './src/muilessium-ui/**/*.less',
    ], gulp.series('muilessium-ui:compile-less', 'docs'));

    gulp.watch([
        './src/docs/*.pug'
    ], gulp.series('docs:main'));

    gulp.watch([
        './src/docs/muilessium/*.pug'
    ], gulp.series('docs:muilessium'));

    gulp.watch([
        './src/docs/muilessium-ui/*.pug'
    ], gulp.series('docs:muilessium-ui'));
});




gulp.task('default', (done) => {
    switch (ENVIRONMENT) {
        case 'production': {
            gulp.series(
                'muilessium',
                'muilessium-ui',
                'docs'
            )();

            break;
        }

        case 'development': {
            gulp.series(
                'muilessium:compile-js',
                'muilessium-ui:compile-js',
                'muilessium-ui:compile-less',
                'docs',
                'browser-sync'
            )();

            break;
        }

        default: {
            break;
        }
    }

    done();
});



gulp.task('serve', gulp.series('default', 'browser-sync'));

