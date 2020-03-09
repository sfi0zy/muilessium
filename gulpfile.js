// -----------------------------------------------------------------------------
//  GULPFILE
// -----------------------------------------------------------------------------
//
//  All steps of the building process are here.
//


const gulp         = require('gulp');
const $            = require('gulp-load-plugins')();
const fs           = require('fs');
const path         = require('path');
const argv         = require('yargs').argv;
const webpack      = require('webpack-stream');
const browserSync  = require('browser-sync').create();

const dss          = require('./gulp-plugins/gulp-dss.js');
const validate     = require('./gulp-plugins/gulp-w3c-validate');



require('colors');



const pkg         = JSON.parse(fs.readFileSync('./package.json'));
const ENVIRONMENT = argv.production ? 'production' : 'development';



// -----------------------------------------------------------------------------
//  INFORMATION ABOUT THIS PROJECT
// -----------------------------------------------------------------------------
//
//  The process begins with displaying information about current project.
//  This is a very good idea, because the log includes a lot of information
//  which helps us to understand where can be problem if the build fails.
//  Also, the build log can be used in conversations and no needed to describe
//  what project we are talking about, what versions of dependencies are used etc.
//


// Current time
console.log(`${(new Date()).toString().white}\n`);

// Console command that starts the gulp
console.log(`> ${argv.$0} ${argv._}`);

// Current environment
console.log(ENVIRONMENT.toUpperCase().yellow);

// Version of this package
console.log(`${pkg.name.red} ${pkg.version.green}\n`);

// Target browsers
console.log('%s\n'.blue, pkg.browserslist);



// -----------------------------------------------------------------------------
//  LIST AND SAVE THE DEPENDENCIES
// -----------------------------------------------------------------------------
//
// Sometimes we want to know the real versions of the main dependencies in
// the project. Package-lock file is not human-friendly, so we save the current
// versions of dependencies right in the package.json. We'll must update
// them manually in the future.
//


console.log('DEPENDENCIES:');

Object.keys(pkg.dependencies).forEach((dependency) => {
    const depPackage = JSON.parse(
        fs.readFileSync(
            path.join('node_modules', dependency, 'package.json'), 'utf-8'));

    if (depPackage._requested.registry) {
        pkg.dependencies[dependency] = depPackage.version;
        console.log('NPM %s@%s'.green, dependency, depPackage.version);
    } else {
        pkg.dependencies[dependency] = depPackage._resolved;
        console.log('--- %s@%s'.green, dependency, depPackage._resolved);
    }
});


console.log('\nDEV DEPENDENCIES:');

Object.keys(pkg.devDependencies).forEach((dependency) => {
    const depPackage = JSON.parse(
        fs.readFileSync(
            path.join('node_modules', dependency, 'package.json'), 'utf-8'));

    if (depPackage._requested.registry) {
        pkg.devDependencies[dependency] = depPackage.version;
        console.log('NPM %s@%s'.green, dependency, depPackage.version);
    } else {
        pkg.devDependencies[dependency] = depPackage._resolved;
        console.log('--- %s@%s'.green, dependency, depPackage._resolved);
    }
});


const newPackageJSON = JSON.stringify(pkg, null, 2);

fs.writeFileSync(path.join('package.json'), newPackageJSON, 'utf-8');

console.log('\n\n\n');




// -----------------------------------------------------------------------------
//  GULP TASKS
// -----------------------------------------------------------------------------
//
//  We use separate tasks for different logical actions.
//


// -----------------------------------------------------------------------------
//  ACTIONS
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


gulp.task('muilessium-ui:lint-less', () => {
    return gulp.src('./src/**/*.less')
        .pipe($.stylelint({
            failAfterError: false,
            reporters: [
                { formatter: 'string', console: true }
            ]
        }));
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
    'muilessium-ui:lint-less',
    'muilessium-ui:compile-less'
));


gulp.task('docs:main', () => {
    return gulp.src('./src/muilessium-ui/components/**/*.less')
        .pipe(dss({
            pkg,
            templatePath: './src/docs',
            parsers: require('./dss.parsers.js'),
            outputPath: './dist'
        }))
        .pipe(gulp.dest('./dist'))
        .pipe($.if(ENVIRONMENT === 'production', validate()))
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
        .pipe($.if(ENVIRONMENT === 'production', validate()))
        .pipe(browserSync.stream());
});


gulp.task('docs:muilessium-ru', () => {
    return gulp.src('./src/muilessium-ui/components/**/*.less')
        .pipe(dss({
            pkg,
            templatePath: './src/docs/ru/muilessium',
            parsers: require('./dss.parsers.js'),
            outputPath: './dist/ru/muilessium'
        }))
        .pipe(gulp.dest('./dist/ru/muilessium'))
        .pipe($.if(ENVIRONMENT === 'production', validate()))
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
        .pipe($.if(ENVIRONMENT === 'production', validate()))
        .pipe(browserSync.stream());
});


gulp.task('docs:muilessium-ui-ru', () => {
    return gulp.src('./src/muilessium-ui/components/**/*.less')
        .pipe(dss({
            pkg,
            templatePath: './src/docs/ru/muilessium-ui',
            parsers: require('./dss.parsers.js'),
            outputPath: './dist/ru/muilessium-ui'
        }))
        .pipe(gulp.dest('./dist/ru/muilessium-ui'))
        .pipe($.if(ENVIRONMENT === 'production', validate()))
        .pipe(browserSync.stream());
});


gulp.task('docs', gulp.series(
    'docs:main',
    'docs:muilessium',
    'docs:muilessium-ru',
    'docs:muilessium-ui',
    'docs:muilessium-ui-ru',
));



// -----------------------------------------------------------------------------
//  BROWSER SYNC
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
    ], gulp.series(
        'muilessium-ui:lint-less',
        'muilessium-ui:compile-less',
        'docs'
    ));

    gulp.watch([
        './src/docs/*.pug'
    ], gulp.series('docs:main'));

    gulp.watch([
        './src/docs/muilessium/*.pug'
    ], gulp.series('docs:muilessium'));

    gulp.watch([
        './src/docs/ru/muilessium/*.pug'
    ], gulp.series('docs:muilessium-ru'));

    gulp.watch([
        './src/docs/muilessium-ui/*.pug'
    ], gulp.series('docs:muilessium-ui'));

    gulp.watch([
        './src/docs/ru/muilessium-ui/*.pug'
    ], gulp.series('docs:muilessium-ui-ru'));
});



// -----------------------------------------------------------------------------
//  DEFAULT TASK
// -----------------------------------------------------------------------------



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
                'muilessium',
                'muilessium-ui',
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



// -----------------------------------------------------------------------------
//  SERVER
// -----------------------------------------------------------------------------


gulp.task('serve', gulp.series('default', 'browser-sync'));

