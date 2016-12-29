var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

//合并,压缩css
gulp.task('minifycss', function() {
    return gulp.src('public/javascripts/*.css')      //压缩的文件
        .pipe(gulp.dest('public/dist'))   //输出文件夹
        .pipe(minifycss());   //执行压缩
});


// 合并，压缩文件
gulp.task('scripts', function() {
    gulp.src('public/javascripts/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('public/dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify().on('error',function(e) {
            console.log(e);
        }))
        .pipe(gulp.dest('public/dist'));
});

gulp.task('default', function(){
    gulp.run('scripts');
    gulp.watch('./js/*.js', function(){
        gulp.run('scripts');
    });
});