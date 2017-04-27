var gulp = require('gulp');
var connect = require('gulp-connect');
var inject = require('gulp-inject');
var	webserver = require("gulp-webserver");

gulp.task("webserver",function(){
	gulp.src("../")
		.pipe(webserver({
			open:"http://localhost:8080/app/index.html",
			port:8080
		}));
});

gulp.task('connect', function() {
  connect.server({
    root: 'src',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
});

gulp.task('index', function () {
  var target = gulp.src('../app/*.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['./**/*.js', './**/*.css'], {read: false});

  return target.pipe(inject(sources))
    .pipe(gulp.dest('./src'));
});

//运行Gulp时，默认的Task
gulp.task('default', ['index', 'connect', 'watch','webserver']);