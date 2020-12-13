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
            "node_modules/jquery/dist/jquery.min.js",
            "node_modules/jquery-validation/dist/jquery.validate.min.js",
            "node_modules/jquery-validation-unobtrusive/dist/jquery.validate.unobtrusive.min.js",
            "node_modules/jquery-ajax-unobtrusive/dist/jquery.unobtrusive-ajax.min.js",
            "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
            "node_modules/cropperjs/dist/cropper.min.js",
            "node_modules/lightbox2/dist/js/lightbox.min.js",
            "node_modules/selectize/dist/js/standalone/selectize.js", // todo: no min version?
        ])
        .pipe(dest("wwwroot/dist/js"));
}

function copyAce() {
    return src([
            "node_modules/ace-builds/src-min/ace.js",
            "node_modules/ace-builds/src-min/mode-markdown.js",
            "node_modules/ace-builds/src-min/theme-twilight.js",
        ])
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("wwwroot/dist/js"));
}

function copyImages() {
    return src("node_modules/lightbox2/dist/images/*")
        .pipe(dest("wwwroot/dist/images"));
}

function copyFonts() {
    return src("node_modules/@fortawesome/fontawesome-free/webfonts/*")
        .pipe(dest("wwwroot/dist/webfonts"));
}

function buildJs() {
    return src("wwwroot/src/js/**/*.js")
        .pipe(minify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("wwwroot/dist/js"));
}

function buildScss() {
    return src("wwwroot/src/scss/main.scss")
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
    parallel(copyJs, copyAce, copyImages, copyFonts, buildJs, buildScss);

exports.watch = () =>
    watch("wwwroot/src/**/*", parallel(buildJs, buildScss));
