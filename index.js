#!/usr/bin/env node

'use strict';

const recursive = require('recursive-readdir-synchronous');
const parseCssUrls = require('css-url-parser');
const fs = require('fs');
const path = require('path');
const isurl = require('is-url');
const program = require('commander');

/**
 * Check a folder.
 * @return {number}
 */
function checkFolder() {
  let errors = 0;
  const files = recursive(program.folder);
  files.forEach(function(file) {
    const ext = path.extname(file);
    if (ext === '.css') {
      const filePath = path.dirname(file) + path.sep;
      const filecontent = fs.readFileSync(file, {encoding: 'utf-8'});
      const cssUrls = parseCssUrls(filecontent);
      cssUrls.forEach(function(cssUrl) {
        if (isurl(cssUrl)) {
        } else {
          const cssReal = cssUrl.replace(/(\?|#).*$/, '');
          let fullPath = filePath + cssReal;
          if (cssReal.charAt(0) === '/') {
            fullPath = program.folder + cssReal;
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
            if (program.verbose) {
              console.log('OK: ' + fullPath);
            }
          }
        }
      });
    }
  });
  console.log('Number of errors: ' + errors);
  return errors;
}

program
    .description('Checks if all images in CSS files exists')
    .option('-f, --folder <folder>', 'Folder with CSS files to check')
    .option('-v, --verbose', 'Add more output')
    .parse(process.argv);

if (program.folder) {
  if (fs.existsSync(program.folder)) {
    const stats = fs.statSync(program.folder);
    if (stats.isDirectory()) {
      const err = checkFolder();
      if (err > 0) {
        process.exitCode = 1;
      } else {
        process.exitCode = 0;
      }
    } else {
      console.log('Oops! Folder is not a real folder: ' + program.folder);
      process.exitCode = 4;
    }
  } else {
    console.log('Oops! Folder does not exists: ' + program.folder);
    process.exitCode = 3;
  }
} else {
  console.log('Oops! Please specify a folder');
  process.exitCode = 2;
}
