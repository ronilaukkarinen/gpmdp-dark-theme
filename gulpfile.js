var changed     = require('gulp-changed');
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var notify      = require('gulp-notify');
var prefix      = require('gulp-autoprefixer');
var minifycss   = require('gulp-clean-css');
var uglify      = require('gulp-uglify');
var cache       = require('gulp-cache');
var concat      = require('gulp-concat');
var util        = require('gulp-util');
var header      = require('gulp-header');
var pixrem      = require('gulp-pixrem');
var exec        = require('child_process').exec;
var rename      = require('gulp-rename');

// Files
var styles = 'src/black.scss';
// var js = 'assets/js/src/*.js';
// var php = '**/*.php';

// Errors
var handleError = function(task) {
  return function(err) {

      notify.onError({
        message: task + ' failed, check the logs..'
      })(err);

    util.log(util.colors.bgRed(task + ' error:'), util.colors.red(err));
  };
};

// Sync
gulp.task('browsersync', function() {

  var files = [
    // php,
    // js
  ];

  browserSync.init(files, {
    proxy: "gpmdp.dev/tests/",
    browser: "Google Chrome",
    notify: true
  });

});

// Styles
gulp.task('styles', function() {

  gulp.src(styles)

    .pipe(sass({
      compass: false,
      bundleExec: true,
      sourcemap: false,
      style: 'compressed',
      debugInfo: true,
      lineNumbers: true,
      errLogToConsole: true,
      includePaths: [
        'node_modules/',
        // 'bower_components/',
        // require('node-bourbon').includePaths
      ],
    }))

    .on('error', handleError('styles'))
    .pipe(prefix('last 3 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(pixrem())
    .pipe(minifycss({
      advanced: true,
      keepBreaks: false,
      keepSpecialComments: 0,
      mediaMerging: true,
      sourceMap: false,
      debug: true
    }, function(details) {
        console.log('[clean-css] Original size: ' + details.stats.originalSize + ' bytes');
        console.log('[clean-css] Minified size: ' + details.stats.minifiedSize + ' bytes');
        console.log('[clean-css] Time spent on minification: ' + details.stats.timeSpent + ' ms');
        console.log('[clean-css] Compression efficiency: ' + details.stats.efficiency * 100 + ' %');
    }))
    .pipe(gulp.dest('./'))
    .pipe(rename('spotify-black.css'))

    // Also update Radiant Player CSS:
    // .pipe(gulp.dest('/Applications/Radiant Player.app/Contents/Resources/css/'))
    .pipe(browserSync.stream());

});

// Scripts
var currentDate   = util.date(new Date(), 'dd-mm-yyyy HH:ss');
var pkg       = require('./package.json');
var banner      = '/*! <%= pkg.name %> <%= currentDate %> - <%= pkg.author %> */\n';

// gulp.task('js', function() {
//
//       gulp.src(
//         [
//           'node_modules/jquery/dist/jquery.js',
//           'assets/js/src/scripts.js'
//         ])
//         .pipe(concat('global.js'))
//         .pipe(uglify({preserveComments: false, compress: true, mangle: true}).on('error',function(e){console.log('\x07',e.message);return this.end();}))
//         .pipe(header(banner, {pkg: pkg, currentDate: currentDate}))
//         .pipe(gulp.dest('./assets/js/'));
// });

// Watch
// gulp.task('js-watch', ['js'], browserSync.reload);
gulp.task('watch', ['browsersync'], function() {

  gulp.watch(styles, ['styles']);
  // gulp.watch(js, ['js-watch']);

});
