var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');


gulp.task('compress', function() {
    return gulp.src('./develop/javascript/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public/javascript'))
        .pipe(livereload());
});
gulp.task('sass', function(){
    var option = {
        outputStyle :"compressed",
        includePaths:["./node_modules/bootstrap/scss/"]
    };
    return gulp.src('./develop/stylesheet/**/*.scss')
        .pipe(sass(option).on('error', sass.logError))
        .pipe(gulp.dest('./public/stylesheet'))
        .pipe(livereload());
});
gulp.task('default', function(){
    livereload.listen();
    gulp.watch("./develop/stylesheet/**/*.scss", ['sass']);
    gulp.watch("./develop/javascript/**/*.js", ['compress']);
});