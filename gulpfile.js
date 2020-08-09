var gulp = require('gulp');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber'); //muestra errores
var useref = require('gulp-useref'); //concatena js
var uglify = require('gulp-uglify'); // minifica js
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence');
// var concat   = require('gulp-concat');
// var font2css = require('gulp-font2css').default

var browserSync = require('browser-sync').create();

gulp.task('stylus',()=>{
  gulp.src('./app/stylus/**/*.styl')
    .pipe(plumber())
    .pipe(stylus({
      compress: false,
      'include css': true
    }))
    .pipe(autoprefixer({
      browsers:['last 3 versions']
    }))
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.stream())
})

gulp.task('browserSync', ()=>{
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  })
})

gulp.task('useref', ()=>{
  return gulp.src('app/*.html')
  .pipe(useref())
  .pipe(gulp.dest('dist'))
  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulpIf('*.css', cssnano()))
  .pipe(gulp.dest('dist'))
})

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

// gulp.task('fonts', ()=> {
//   return gulp.src('./app/fonts/**/*.{otf,ttf,woff,woff2}')
//     .pipe(font2css())
//     .pipe(concat('fonts.css'))
//     .pipe(gulp.dest('dist/css'))
// })

gulp.task('watch',['browserSync','stylus'], ()=>{
  gulp.watch('./app/stylus/**/*.styl',['stylus'])
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
})

gulp.task('build', function (callback) {
  runSequence(['stylus','useref','fonts'],
    callback
  )
})
gulp.task('default', function (callback) {
  runSequence(['stylus','useref','fonts','browserSync', 'watch'],
    callback
  )
})
