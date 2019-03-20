"use strict";

const assert = require('assert');
const path = require('path');
const spawn = require('child_process').spawn;
const expect = require('chai').expect;

describe('index.js', function () {
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

    it('should exit 0 having no css problems with url params ?', function (done) {
        var out = '';
        spawn('node', [path.join(__dirname, '../index.js'), '--folder', 'test/css2'], {
            cwd: path.join(__dirname, '../'),
        }).on('exit', function (code) {
            assert.equal(code, 0);
            expect(out).to.match(/Number of errors: 0/);
            done();
        }).stdout.on('data', function (data) {
            out += data;
        });
    });

    it('should exit 0 having no css problems without url params', function (done) {
        var out = '';
        spawn('node', [path.join(__dirname, '../index.js'), '--folder', 'test/css3'], {
            cwd: path.join(__dirname, '../'),
        }).on('exit', function (code) {
            assert.equal(code, 0);
            expect(out).to.match(/Number of errors: 0/);
            done();
        }).stdout.on('data', function (data) {
            out += data;
        });
    });

    it('should exit 0 having css problems with url params #', function (done) {
        var out = '';
        spawn('node', [path.join(__dirname, '../index.js'), '--folder', 'test/css4'], {
            cwd: path.join(__dirname, '../'),
        }).on('exit', function (code) {
            assert.equal(code, 0);
            expect(out).to.match(/Number of errors: 0/);
            done();
        }).stdout.on('data', function (data) {
            out += data;
        });
    });

    it('should exit 0 having no css problems absolute and url params', function (done) {
        var out = '';
        spawn('node', [path.join(__dirname, '../index.js'), '--folder', 'test/css5'], {
            cwd: path.join(__dirname, '../'),
        }).on('exit', function (code) {
            assert.equal(code, 0);
            expect(out).to.match(/Number of errors: 0/);
            done();
        }).stdout.on('data', function (data) {
            out += data;
        });
    });

    it('should exit 1 having css problems absolute', function (done) {
        var out = '';
        spawn('node', [path.join(__dirname, '../index.js'), '--folder', 'test/css6'], {
            cwd: path.join(__dirname, '../'),
        }).on('exit', function (code) {
            assert.equal(code, 1);
            expect(out).to.match(/Error found in:.*?style\.css/);
            expect(out).to.match(/Full path not found: test\/css6\/404\/firefox\.png/);
            expect(out).to.match(/Path in CSS file: \/404\/firefox\.png\?\#iefix/);
            expect(out).to.match(/Original path in CSS file: \/404\/firefox\.png/);
            expect(out).to.match(/Full path not found: test\/css6\/40\/firefox\.png/);
            expect(out).to.match(/Path in CSS file: \/40\/firefox\.png/);
            expect(out).to.match(/Number of errors: 2/);
            done();
        }).stdout.on('data', function (data) {
            out += data;
        });
    });

    it('should exit 0 having css problems url', function (done) {
        var out = '';
        spawn('node', [path.join(__dirname, '../index.js'), '--folder', 'test/css7'], {
            cwd: path.join(__dirname, '../'),
        }).on('exit', function (code) {
            assert.equal(code, 0);
            expect(out).to.match(/Number of errors: 0/);
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

    it('should exit 4 if folder is not a folder', function (done) {
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
