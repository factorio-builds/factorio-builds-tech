/// <binding AfterBuild='build' Clean='clean' />

"use strict";

const { src, dest, watch, parallel } = require("gulp");
const { init, write } = require("gulp-sourcemaps");
const sass = require("gulp-dart-sass");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const del = require("del");

function copyDepsJs() {
    return src([
            "node_modules/bootstrap/dist/js/**/*.js",
            "node_modules/jquery/dist/**/*.js",
            "node_modules/jquery-validation/dist/**/*.js",
            "node_modules/jquery-validation-unobtrusive/dist/**/*.js",
        ]).pipe(dest("wwwroot/js"));
}

function copyDepsCss() {
    return src([
            "node_modules/bootstrap/dist/css/**/*.css",
        ]).pipe(dest("wwwroot/css"));
}

//function buildScss() {
//    return src("scss/main.scss")
//        .pipe(sass().on("error", sass.logError))
//        .pipe(init())
//        .pipe(autoprefixer())
//        .pipe(csso())
//        .pipe(rename({ suffix: ".min" }))
//        .pipe(write("."))
//        .pipe(dest("wwwroot/css"));
//}

exports.clean = () =>
    del(["wwwroot"]);

exports.build =
    parallel(copyDepsJs, copyDepsCss);

//exports.watch = () =>
//    watch("scss/**/*.scss", buildScss);
