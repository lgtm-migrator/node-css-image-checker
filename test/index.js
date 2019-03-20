"use strict";

const assert = require('assert');
const path = require('path');
const spawn = require('child_process').spawn;
var expect = require('chai').expect;

describe('index.js', function () {
    this.timeout(8000);

    it('should exit 1 having css problems', function (done) {
        var out = '';
        spawn('node', [path.join(__dirname, '../index.js'), '--folder', 'test/css1'], {
            cwd: path.join(__dirname, '../'),
        }).on('exit', function (code) {
            assert.equal(code, 1);
            expect(out).to.match(/Error found in:.*?style\.css/);
            expect(out).to.match(/Full path not found.*?\.\.\/img\/404\.png/);
            expect(out).to.match(/Path in CSS file: \.\.\/img\/404\.png\?v=5/);
            expect(out).to.match(/Original path in CSS file: \.\.\/img\/404\.png/);
            done();
        }).stdout.on('data', function (data) {
            out += data;
        });
    });

    it('should exit 1 having css problems', function (done) {
        var out = '';
        spawn('node', [path.join(__dirname, '../index.js'), '--folder', 'test/css2'], {
            cwd: path.join(__dirname, '../'),
        }).on('exit', function (code) {
            assert.equal(code, 0);
            console.log(out.toString());
            expect(out).to.match(/Error found in:.*?style\.css/);
            expect(out).to.match(/Full path not found.*?\.\.\/img\/404\.png/);
            expect(out).to.match(/Path in CSS file: \.\.\/img\/404\.png\?v=5/);
            expect(out).to.match(/Original path in CSS file: \.\.\/img\/404\.png/);
            done();
        }).stdout.on('data', function (data) {
            out += data;
        });
    });

    it('should exit 2 if no folder is specified', function (done) {
        spawn('node', [path.join(__dirname, '../index.js')], {
            cwd: path.join(__dirname, '../'),
        }).on('exit', function (code) {
            assert.equal(code, 2);
        }).stdout.on('data', function (data) {
            //console.log('data:' + data.toString());
            assert.equal(data.toString(), 'Oops! Please specify a folder\n');
            done();
        });
    });

    it('should exit 3 if folder does not exist', function (done) {
        spawn('node', [path.join(__dirname, '../index.js'), '--folder', '404'], {
            cwd: path.join(__dirname, '../'),
        }).on('exit', function (code) {
            assert.equal(code, 3);
        }).stdout.on('data', function (data) {
            assert.equal(data.toString(), 'Oops! Folder does not exists: 404\n');
            done();
        });
    });

    it('should exit 4 if folder does not exist', function (done) {
        spawn('node', [path.join(__dirname, '../index.js'), '--folder', 'test/index.js'], {
            cwd: path.join(__dirname, '../'),
        }).on('exit', function (code) {
            assert.equal(code, 4);
        }).stdout.on('data', function (data) {
            assert.equal(data.toString(), 'Oops! Folder is not a real folder: test/index.js\n');
            done();
        });
    });

});
