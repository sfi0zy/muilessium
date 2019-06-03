const gulp         = require('gulp');
const $            = require('gulp-load-plugins')();
const fs           = require('fs');
const argv         = require('yargs').argv;
const webpack      = require('webpack-stream');
const browserSync  = require('browser-sync').create();


const pkg         = JSON.parse(fs.readFileSync('./package.json'));
const ENVIRONMENT = argv.production ? 'production' : 'development';


console.log('\x1b[33m%s %s\x1b[0m\n  ⇒ %s', ' ',
    ENVIRONMENT.toUpperCase(), `${pkg.name} v${pkg.version}`);
console.log('\x1b[36m%s %s\x1b[0m\n  ⇒ %s', ' ',
    'Browsers:', pkg.browserslist);



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

