// gulpfile.js
import gulp from 'gulp';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';

gulp.task('default', function () {
  return (
    gulp
      .src(['js/jquery-3.7.1.min.js', 'js/js2.js', 'js/js1.js'])
      .pipe(concat('all.min.js'))
      //.pipe(uglify())
      .pipe(gulp.dest('./js'))
  );
});
