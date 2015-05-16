/*jslint indent:2, node:true*/
"use strict";

var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  gutil = require('gulp-util');

gulp.task('mocha', function () {
  return gulp.src(['test/*.js'], { read: false })
             .pipe(mocha({ reporter: 'list' }))
             .on('error', gutil.log);
});

gulp.task('watch-mocha', function () {
  gulp.watch(['**'], ['mocha']);
});

gulp.task('default', ['mocha', 'watch-mocha']);
