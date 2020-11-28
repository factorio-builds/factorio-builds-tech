/// <binding AfterBuild='build' Clean='clean' />

"use strict";

const { src, dest, watch, parallel } = require("gulp");
const { init, write } = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const minify = require("gulp-babel-minify");
const rename = require("gulp-rename");
const sass = require("gulp-dart-sass");
const del = require("del");

function copyJs() {
    return src([
            "node_modules/bootstrap/dist/js/**/*.min.js",
            "node_modules/jquery/dist/**/*.min.js",
            "node_modules/jquery-validation/dist/**/*.min.js",
            "node_modules/jquery-validation-unobtrusive/dist/**/*.min.js",
            "node_modules/jquery-ajax-unobtrusive/dist/**/*.min.js",
            "node_modules/selectize/dist/js/**/*.js", // todo current build is broken; doesn't contain min
        ]).pipe(dest("wwwroot/dist/js"));
}

function copyFonts() {
    return src("node_modules/@fortawesome/fontawesome-free/webfonts/*")
        .pipe(dest("wwwroot/dist/webfonts"));
}

function buildJs() {
    return src("site.js")
        .pipe(minify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("wwwroot/dist/js"));
}

function buildScss() {
    return src("scss/main.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(init())
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(rename({ suffix: ".min" }))
        .pipe(write("."))
        .pipe(dest("wwwroot/dist/css"));
}

exports.clean = () =>
    del(["wwwroot/dist"]);

exports.build =
    parallel(copyJs, copyFonts, buildJs, buildScss);

exports.watch = () =>
    watch(
        ["scss/**/*.scss", "site.js"],
        parallel(buildJs, buildScss));
