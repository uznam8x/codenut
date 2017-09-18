var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');

gulp.task('compress', function() {
    return gulp.src('./develop/javascript/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public/javascript'))
        .pipe(livereload());
});

gulp.task('sass', function(){
    var option = {
        outputStyle :"expanded",//"compressed",
        includePaths:["./public/javascript/libs/bootstrap/scss/", "./develop/stylesheet/"]
    };
    return gulp.src('./develop/stylesheet/**/*.scss')
        .pipe(sass(option).on('error', sass.logError))
        .pipe(gulp.dest('./public/stylesheet'))
        .pipe(livereload());
});
gulp.task('watch', function(){
    livereload.listen();
    gulp.watch("./develop/stylesheet/**/*.scss", ['sass']);
    gulp.watch("./develop/javascript/**/*.js", ['compress']);
});

gulp.task('serve', ['server','watch']);

gulp.task('server',function(){
    nodemon({
        'script': './bin/www',
        'ignore': 'public/js/*.js'
    });
});