var gulp = require('gulp');
var env  = require('gulp-env');
var browserify = require('browserify'); //npm install browserify --save-dev
var source = require('vinyl-source-stream'); //npm install vinyl-source-stream --save-dev
var concat = require('gulp-concat'); //npm install gulp-concat --save-dev
var uglify = require('gulp-uglify'); //npm install gulp-uglify --save-dev
var utilities = require('gulp-util'); //npm install gulp-util --save-dev
var del = require('del'); //npm install del --save-dev
var jshint = require('gulp-jshint'); //npm install jshint --save-dev
var moment = require('moment'); //npm install moment --save-dev || npm install gulp-jshint --save-dev
var lib = require('bower-files')({ //npm install bower-files --save-dev
  "overrides":{
    "bootstrap" : {
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js"
      ]
    }
  }
});
var browserSync = require('browser-sync').create(); //npm install browser-sync --save-dev
var buildProduction = utilities.env.production;

//gulp jsBrowserify

gulp.task('concatScripts', function() {
  return gulp.src(['./js/*-interface.js'])
    .pipe(concat('allConcat.js'))
    .pipe(gulp.dest('./tmp'));
});

gulp.task('jsBrowserify', ['concatScripts'], function() {
  return browserify({ entries: ['./tmp/allConcat.js'] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('minifyScripts', ['jsBrowserify'], function() {
  return gulp.src('./build/js/app.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('jshint', function() {
  return gulp.src(['js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('clean', function() {
  return del(['build', 'clean'])
});

gulp.task('build', ['clean'], function() {
  if (buildProduction) {
    gulp.start('minifyScripts');
  } else {
    gulp.start('jsBrowserify');
  }
  gulp.start('bower');
  gulp.start('cssBuild');
});

gulp.task('jsBower', function() {
  return gulp.src(lib.ext('js').files)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('bowerCSS', function() {
  return gulp.src(lib.ext('css').files)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('bower', ['jsBower', 'bowerCSS']);

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });
  gulp.watch(['js/*.js'], ['jsBuild']);
  gulp.watch(['css/*.css'], ['cssBuild']);
  gulp.watch(['bower.json'], ['bowerBuild']);
  gulp.watch(['*.html'], ['htmlBuild']);
});

gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function(){
  browserSync.reload();
});

gulp.task('cssBuild', function(){
  browserSync.reload();
});

gulp.task('htmlBuild', function(){
  browserSync.reload();
});

gulp.task('bowerBuild', ['bower'], function() {
  browserSync.reload();
})

gulp.task('stream', ['build'], function() {
  return gulp.watch('js/**/*.js', ['build'])
});
