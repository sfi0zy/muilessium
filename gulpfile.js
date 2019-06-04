const gulp         = require('gulp');
const $            = require('gulp-load-plugins')();
const fs           = require('fs');
const path         = require('path');
const argv         = require('yargs').argv;
const webpack      = require('webpack-stream');
const browserSync  = require('browser-sync').create();

require('colors');

const pkg         = JSON.parse(fs.readFileSync('./package.json'));
const ENVIRONMENT = argv.production ? 'production' : 'development';



// -----------------------------------------------------------------------------

console.log(`${Date.now().toString().white}\n`);
console.log(ENVIRONMENT.toUpperCase().yellow);
console.log(`${pkg.name.red} ${pkg.version.green}\n`);
console.log('%s\n'.blue, pkg.browserslist);
console.log('DEV DEPENDENCIES:');

let isDependenciesSaved = true;

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



gulp.task('less', () => {
    return gulp.src('./src/less/main.less')
        .pipe($.if(ENVIRONMENT === 'development', $.sourcemaps.init()))
        .pipe($.less())
        .pipe($.postcss())
        .pipe($.if(ENVIRONMENT === 'development', $.sourcemaps.write()))
        .pipe($.rename('muilessium.min.css'))
        .pipe($.size({ showFiles: true }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});


gulp.task('js', () => {
    return gulp.src('./src/js/main.js')
        .pipe(webpack(require('./webpack.config.js')[ENVIRONMENT]))
        .pipe($.rename('muilessium.min.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
});


gulp.task('lint-js', () => {
    return gulp.src('./src/**/*.js')
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
});


gulp.task('dss', () => {
    return gulp.src('./src/less/components/*.less')
        .pipe($.dss(require('./dss.config.js')))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});


gulp.task('test', () => {
    return gulp.src('./test/utils/*.js')
        .pipe($.nodeunit());
});


gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch([
        './src/less/*.less',
        './src/less/components/*.less'
    ], gulp.parallel('less', 'dss'));

    gulp.watch([
        './src/js/*.js',
        './src/js/*/*.js'
    ], gulp.parallel('js'));

    gulp.watch([
        './src/dss/index.handlebars'
    ], gulp.parallel('dss'));
});


gulp.task('default', (done) => {
    if (ENVIRONMENT === 'production') {
        gulp.series('less', 'lint-js', 'test', 'js', 'dss')();
    } else {
        gulp.series('less', 'js', 'dss')();
    }

    done();
});


gulp.task('server', (done) => {
    gulp.series('default', 'browser-sync')();

    done();
});

