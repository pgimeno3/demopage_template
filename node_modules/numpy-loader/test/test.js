const assert = require('assert');
const fs = require('fs')
const NumpyParser = require('numpy-parser');
const NumpyLoader = require('../src/main.js');

describe('NumpyLoader', function() {

  describe('#load())', function() {

    it('should embed the data if asked to', function(done) {
      const buffer = fs.readFileSync('./test/data/array_uint8.npy'); // no encoding
      const resultModule = NumpyLoader(buffer);
      const result = resultModule.load( function(typedArray) {
        assert.equal(typedArray.data.length, 10);
        done();
      })

    });

  });

});
