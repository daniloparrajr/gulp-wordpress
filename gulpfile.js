var themeName = 'humescores',
    siteUrl = 'http://humescores.localhost',
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-dart-sass'),
    cleanCss = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    imageMin = require('gulp-imagemin'),
    sourceMaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    newer = require('gulp-newer'),
    changed = require('gulp-change');

var root = '../' + themeName + '/',
    scss = root + 'sass/',
    js = root + 'js/',
    jsDist = root + 'dist/js/'; // The script should create this folder structure.

var phpWatchFiles = root + '**/*.php',
    styleWatchFiles = root + '**/*.scss';

var jsSrc = [
    js + 'navigation.js',
    js + 'skip-link-focus-fix.js'
];

var imageSrc = root + 'images/*',
    imageDest = root + 'dist/images';

function css() {
    return gulp.src([scss + 'style.scss'])
        .pipe(sourceMaps.init({
            loadMaps: true
        }))
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(cleanCss())
        .pipe(sourceMaps.write('sourcemaps'))
        .pipe(gulp.dest(root));
}

function woocommerceCss() {
    return gulp.src([scss + 'woocommerce.scss'])
        .pipe(sourceMaps.init({
            loadMaps: true
        }))
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sourceMaps.write('sourcemaps'))
        .pipe(gulp.dest(root));
}

function javascript() {
    return gulp.src(jsSrc)
        .pipe(concat('site-script.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDist));
}

function imgmin() {
    return gulp.src(imageSrc)
        .pipe(newer(imageDest))
        .pipe(imageMin([
            imageMin.gifsicle({
                interlaced: true
            }),
            imageMin.jpegtran({
                progressive: true
            }),
            imageMin.optipng({
                optimizationLevel: 5
            })
        ]))
        .pipe(gulp.dest(imageDest));
}

function watch() {
    browserSync.init({
        open: 'external',
        proxy: siteUrl,
        port: 8080,
    });
    gulp.watch(styleWatchFiles, gulp.parallel([css, woocommerceCss]));
    gulp.watch(jsSrc, javascript);
    gulp.watch(imageSrc, imgmin);
    // gulp.watch([phpWatchFiles, jsDist + 'site-script.js', 'style.css']).on('change', browserSync.reload);
    gulp.watch(root + '**/*').on('change', browserSync.reload);
}

exports.css = css;
exports.woocommerceCss = woocommerceCss;
exports.javascript = javascript;
exports.watch = watch;
exports.imgmin = imgmin;

var build = gulp.parallel(watch);
gulp.task('default', build);