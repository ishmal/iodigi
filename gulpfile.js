var gulp = require('gulp');
var gutil = require("gulp-util");
var rimraf = require('rimraf');
var webpack = require('webpack');
var jshint = require('gulp-jshint');

 
gulp.task('lint', function() {
  return gulp.src('./src/lib/*.js')
    .pipe(jshint({esnext: true}))
    .pipe(jshint.reporter('default'));
});


gulp.task("webpack", function(callback) {

    var config = {
        context: __dirname + "/src",
        entry: './digi',
        target: 'node',
        output: {
            path: __dirname,
            filename: 'index.js',
            library: true,
            libraryTarget: 'commonjs2'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    query: {
                        plugins: ['transform-runtime'],
                        presets: [ 'es2015' ]
                    }
                }
            ]
        }
    };

    webpack(config, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });

});


gulp.task('clean', function(cb) {
  rimraf("./index.js", { force: true }, cb);
});

gulp.task('default', ['webpack']);
