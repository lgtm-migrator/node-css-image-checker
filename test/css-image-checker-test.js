"use strict";

const expect = require('chai').expect;
const cmd = require('./cmd');

describe('The pizza CLI', () => {
  it('should print the correct error', async () => {
    try {
      await cmd.execute('css-image-checker', ['--sausage']);
    } catch(err) {
      expect(err.trim()).to.equal(
        '  Invalid option --sausage'
      );
    }
  });
});