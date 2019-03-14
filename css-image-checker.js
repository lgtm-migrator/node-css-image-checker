#!/usr/bin/env node

const recursive = require("recursive-readdir");
const optimist = require('optimist');
const parseCssUrls = require('css-url-parser');
const fs = require('fs');
const path = require('path');
const isurl = require('is-url');
const folder = optimist.argv["folder"];

const app = {
   init: function(folder) {
     that = this;
     if (folder) {
        if (fs.existsSync(folder)) {
           var stats = fs.statSync(folder);
           if (stats.isDirectory()) {
             that.checkFolder(folder);
           } else {
             console.log("Oops! Not a folder: " + folder);
             return false;
           }
        } else {
           console.log("Oops! Folder does not exists: " + folder);
           return false;
        }
     } else {
        console.log("Oops! Please specify a folder");
        return false;
     }
   },
   checkFolder: function(folder){
     that = this;
     errors = 0;
     recursive(folder, function (err, files) {
      files.forEach(function(file) {
         var ext = path.extname(file)
         if (ext === '.css') {
             //console.log('file: ' + file);
             filePath = path.dirname(file) + path.sep;
             //console.log('filepath: ' + filePath);
             filecontent = fs.readFileSync(file, {encoding: 'utf-8'});
            var cssUrls = parseCssUrls(filecontent);
            //console.log('cssurls: ' + cssUrls);
            cssUrls.forEach(function(cssUrl) {
               if (isurl(cssUrl)) {
               } else {
                  cssReal = cssUrl.replace(/(\?|#).*$/, "");
                  if (cssReal.charAt(0) === '/') {
                  //console.log('From:' + cssUrl + ' to:' + cssReal);
                     fullPath = folder + cssReal;
                  } else {
                     fullPath = filePath + cssReal;
                  }
                  //console.log(fullPath);
                  //fullPath = path.resolve(filePath, cssReal);
                  //console.log(fullPath);
                  //console.log('fullpath: ' + fullPath);
                  if (!fs.existsSync(fullPath)) {
                     console.log('ERROR');
                     console.log('Not found: ' + fullPath);
                     console.log('Not found: ' + cssUrl);
                     console.log('Not found: ' + cssReal);
                     console.log('In file: ' + file);
                     console.log();
                     errors++;
                  } else {
                     //console.log('OK: ' + fullPath);
                  }
               }
            })
         }
       })
       console.log("Number of errors: " + errors);
     });
   }
}
//init the app module with postCount
app.init(folder);

module.exports = app;
