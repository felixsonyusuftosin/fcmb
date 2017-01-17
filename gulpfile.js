
var gulp = require('gulp'),
        gulpWatch = require('gulp-watch'),
        del = require('del'),
        runSequence = require('run-sequence'),
        argv = process.argv;
gulp.task('default', function () { console.log('Hello Gulp!') });
gulp.task('serve:before', ['default']);
/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
gulp.task('serve:before', ['watch']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);
gulp.task('build:before', ['build']);

// we want to 'watch' when livereloading
var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
var buildBrowserify = require('ionic-gulp-browserify-typescript');
var buildSass = require('ionic-gulp-sass-build');
var copyHTML = require('ionic-gulp-html-copy');
var copyFonts = require('ionic-gulp-fonts-copy');
var copyScripts = require('ionic-gulp-scripts-copy');
var tslint = require('ionic-gulp-tslint');
var isRelease = argv.indexOf('--release') > -1;


gulp.task('watch', ['clean','cleanasset'], function (done) {
    runSequence(
            ['img', 'sass', 'html', 'fonts', 'scripts', 'copy-fontawesome-css', 'copy-leaflet-css','leafletimages','copy-routing-machine-css','copy-leaflet-routing-machine_images','copy-leaflet-routing-machine-more-images','copy-leaflet-icon-pulse'],
            function () {
                gulpWatch('src/app/**/*.scss', function () {
                    gulp.start('sass');
                });
                gulpWatch('src/app/**/*.html', function () {
                    gulp.start('html');
                });
                buildBrowserify({watch: true}).on('end', done);
            }
    );
});

gulp.task('build', ['clean','cleanasset'], function (done) {
    runSequence(
            [ 'sass', 'imgbuild', 'copy-fontawesome-cssbuild',  'html', 'fontsbuild', 'scripts','copy-leaflet-cssbuild','leafletimagesbuild','copy-routing-machine-cssbuild','copy-leaflet-routing-machine_imagesbuild','copy-leaflet-routing-machine-more-imagesbuild','copy-leaflet-icon-pulsebuild'],
            function () {
                buildBrowserify({          
                    minify: isRelease,
                    browserifyOptions: {
                        debug: !isRelease
                    },
                    uglifyOptions: {
                        mangle: false
                    }
                }).on('end', done);
            }
    );
});

gulp.task('sass', buildSass);
gulp.task('html', copyHTML);
//gulp.task('fonts', copyFonts);
gulp.task('fonts', function () {
    return copyFonts({
        src: [
            'node_modules/ionic-angular/fonts/**/*.+(ttf|woff|woff2)',
            'node_modules/font-awesome/fonts/**/*.+(eot|ttf|woff|woff2)',
            'src/assets/fonts/**/*.+(ttf|woff|woff2)'
        ],
        dest: 'www/assets/fonts'
    });
});
gulp.task('fontsbuild', function () {
    return copyFonts({
        src: [
            'node_modules/ionic-angular/fonts/**/*.+(ttf|woff|woff2)',
            'node_modules/font-awesome/fonts/**/*.+(eot|ttf|woff|woff2|svg|css)',
            
            'src/assets/fonts/**/*.+(ttf|woff|woff2)'
        ],
        dest: 'www/build/fonts'
    });
});
//gulp.task('scripts', copyScripts);
gulp.task('scripts', function () {
    return copyScripts({
        src: [
            'node_modules/es6-shim/es6-shim.min.js',
            'node_modules/zone.js/dist/zone.js',
            'node_modules/reflect-metadata/Reflect.js',
            'bower_components/sockjs-client/dist/sockjs.min.js',
            'node_modules/vertx3-eventbus-client/vertx-eventbus.js',
            'node_modules/leaflet/dist/leaflet.js',
            'node_modules/leaflet-bing-layer/leaflet-bing-layer.js',
            'node_modules/leaflet-pulse-icon/dist/L.Icon.Pulse.js',
            'node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js',
            'src/assets/js/**/*.+(js|min.js)',
                   ],
                   dest: 'www/build/js'
    });
});


gulp.task('clean', function () {
    return del('www/assets');
});
gulp.task('cleanasset', function () {
    console.log('clean asset');
    return del('www/assets');
});
gulp.task('lint', tslint);
gulp.task('img', function () {
    return gulp.src(['src/assets/img/*'])
            .pipe(gulp.dest('www/assets/img'));
});
gulp.task('imgbuild', function () {
    return gulp.src(['src/assets/img/*'])
            .pipe(gulp.dest('www/build/img'));
});
gulp.task('copy-fontawesome-css', function () {
    gulp.src('node_modules/font-awesome/css/**/*.min.+(css)')
            .pipe(gulp.dest('www/assets/css'));
});
gulp.task('copy-fontawesome-cssbuild', function () {
    gulp.src('node_modules/font-awesome/fonts/*')
            .pipe(gulp.dest('www/assets/fonts'));
});
gulp.task('copy-leaflet-css', function () {
    gulp.src('node_modules/leaflet/dist/leaflet.css')
            .pipe(gulp.dest('www/assets/css'));

});
gulp.task('copy-leaflet-cssbuild', function () {
    gulp.src('node_modules/leaflet/dist/leaflet.css')
            .pipe(gulp.dest('www/build/css'));

});
gulp.task('leafletimages', function () {
    return gulp.src(['node_modules/leaflet/dist/images/*'])
            .pipe(gulp.dest('www/assets/img'));
});
gulp.task('leafletimagesbuild', function () {
    return gulp.src(['node_modules/leaflet/dist/images/*'])
            .pipe(gulp.dest('www/build/img'));
});
gulp.task('copy-routing-machine-css', function () {
    gulp.src('node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.css')
            .pipe(gulp.dest('www/assets/css'));

});
gulp.task('copy-routing-machine-cssbuild', function () {
    gulp.src('node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.css')
            .pipe(gulp.dest('www/build/css'));

});
gulp.task('copy-leaflet-routing-machine_images', function () {
    return gulp.src(['node_modules/leaflet-routing-machine/dist/leaflet.routing.icons.png'])
            .pipe(gulp.dest('www/assets/css'));
});
gulp.task('copy-leaflet-routing-machine_imagesbuild', function () {
    return gulp.src(['node_modules/leaflet-routing-machine/dist/leaflet.routing.icons.png'])
            .pipe(gulp.dest('www/build/css'));
});
gulp.task('copy-leaflet-routing-machine-more-images', function () {
    return gulp.src(['node_modules/leaflet-routing-machine/dist/leaflet.routing.icons.svg'])
            .pipe(gulp.dest('www/assets/css'));
});
gulp.task('copy-leaflet-routing-machine-more-imagesbuild', function () {
    return gulp.src(['node_modules/leaflet-routing-machine/dist/leaflet.routing.icons.svg'])
            .pipe(gulp.dest('www/build/css'));
});
gulp.task('copy-leaflet-icon-pulse', function () {

    gulp.src('node_modules/leaflet-pulse-icon/dist/L.Icon.Pulse.css')

            .pipe(gulp.dest('www/assets/css'));

});
gulp.task('copy-leaflet-icon-pulsebuild', function () {

    gulp.src('node_modules/leaflet-pulse-icon/dist/L.Icon.Pulse.css')

            .pipe(gulp.dest('www/build/css'));

});


