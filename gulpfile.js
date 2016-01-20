const gulp = require('gulp');
const rimraf = require('rimraf');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const Server = require('karma').Server;

gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(jshint({esnext: true}))
    .pipe(jshint.reporter('default'));
});

gulp.task('babel', function () {
    const opts = {
        "presets": ["es2015"]
    };
    return gulp.src('src/**/*.js')
        .pipe(babel(opts))
        .pipe(gulp.dest('lib'));
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('clean', function(cb) {
  rimraf("./lib", { force: true }, cb);
});

gulp.task('default', ['lint', 'babel', 'test']);
