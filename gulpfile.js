var gulp = require('gulp');
var compass = require('gulp-compass');
var minify = require('gulp-minify-css');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').create();
var cached = require('gulp-cached');  //変更されたファイルのみ処理する
var remember = require('gulp-remember'); //キャッシュしたストリームを取り出す

function plumberWithNotify(){
  return plumber({errorHandler: notify.onError("<%= error.message %>")});
}

//compass
gulp.task('compass', function(){
  return gulp.src('./src/sass/**/*.scss')
    .pipe(cached())
    .pipe(plumberWithNotify())
    .pipe(compass({
      config_file: './config.rb',
      css: './src/css',
      sass: './src/sass'
    }))
    .pipe(gulp.dest('./src/css'));
});


//最適化
gulp.task('optimize', function(){
  return gulp.src('./src/css/**/*.css')
    .pipe(minify())
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./src/css'));
});

//browsersync
gulp.task('server',['compass'], function(){
  browserSync.init({
    server: {
      baseDir: './src',
      directory: false
    },
    port: 8001 //localhost:8001
  });
});

gulp.task('bs-reload', function(){
  browserSync.reload();
});

//compass適用後最適化を行う
gulp.task('compassOptimize', function(){
  runSequence(
    'compass',
    'optimize'
  );
});

gulp.task('watch',['server'], function(){
  gulp.watch(['./src/**/*.scss'], ['compass']);
  gulp.watch(['./src/**/*.html'], ['bs-reload']);
  gulp.watch(['./src/**/*.css'], ['bs-reload']);
  gulp.watch(['./src/**/*.js'], ['bs-reload']);
});

// gulp.task('watch', function(){
//   gulp.watch(['./src/**/*.scss'], ['compass']);
// });


//gulp.task('default', ['optimize']);
