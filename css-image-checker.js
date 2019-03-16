#!/usr/bin/env node

"use strict";

const recursive = require("recursive-readdir");
const optimist = require('optimist');
const parseCssUrls = require('css-url-parser');
const fs = require('fs');
const path = require('path');
const isurl = require('is-url');
const folder = optimist.argv['folder'];
const verbose = optimist.argv['verbose'];

const app = {
    init: function(folder, verbose) {
        var that = this;
        if (folder) {
            if (fs.existsSync(folder)) {
                var stats = fs.statSync(folder);
                if (stats.isDirectory()) {
                    var err = that.checkFolder(folder, verbose);
                    return err;
                } else {
                    console.log("Oops! Folder is not a real folder: " + folder);
                    return -1;
                }
            } else {
                console.log("Oops! Folder does not exists: " + folder);
                return -2;
            }
        } else {
            console.log("Oops! Please specify a folder");
            return -3;
        }
    },
    checkFolder: function(folder, verbose){
        var that = this;
        var errors = 0;
        recursive(folder, function(err, files) {
            files.forEach(function (file) {
                var ext = path.extname(file)
                if (ext === '.css') {
                    var filePath = path.dirname(file) + path.sep;
                    var filecontent = fs.readFileSync(file, {encoding: 'utf-8'});
                    var cssUrls = parseCssUrls(filecontent);
                    cssUrls.forEach(function (cssUrl) {
                        if (isurl(cssUrl)) {
                        } else {
                            var cssReal = cssUrl.replace(/(\?|#).*$/, "");
                            var fullPath = filePath + cssReal;
                            if (cssReal.charAt(0) === '/') {
                                fullPath = folder + cssReal;
                            }
                            if (!fs.existsSync(fullPath)) {
                                console.log('Error found in: ' + file);
                                console.log('Full path not found: ' + fullPath);
                                console.log('Path in CSS file: ' + cssUrl);
                                if (cssUrl !== cssReal) {
                                    console.log('Original path in CSS file: ' + cssReal);
                                }
                                console.log();
                                errors++;
                            } else {
                                if (verbose) {
                                    console.log('OK: ' + fullPath);
                                }
                            }
                        }
                    })
                }
            })
        });
        console.log("Number of errors: " + errors);
        return errors;
    }
}

var err = app.init(folder, verbose);
process.exitCode = err

module.exports = app;
