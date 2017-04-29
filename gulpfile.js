const gulp = require('gulp')
const electron = require('electron-connect').server.create()
const sass = require('gulp-sass')

gulp.task('styles', function () {
  gulp.src('./scss/app.scss')
    .pipe(sass({
    }).on('error', sass.logError))
    .pipe(gulp.dest('./css/'))
})

gulp.task('default', function () {
  electron.start()
  gulp.watch('./scss/app.scss', ['styles'])
  gulp.watch(['./js/*.js'], electron.restart)
  gulp.watch(['./css/*.css'], electron.reload)
  gulp.watch(['./index.html'], electron.reload)
})
