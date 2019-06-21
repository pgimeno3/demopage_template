const assert = require('assert');
const loaderUtils = require('loader-utils');
const path = require('path');
const fs = require('fs');

module.exports = function(content) {
  console.log('Distill Numpy Loader says "Hi"! \\o/');

  const pathToNPY = this.resourcePath;
  const fileName = path.basename(pathToNPY);

  const options = loaderUtils.getOptions(this) || {};
  if (options.embed) {
    // base-64 encode file and directly embed in returned module
    const base64data = fs.readFileSync(pathToNPY).toString('base64'); // no encoding
    return `
    const NumpyParser = require("numpy-parser");
    const NDArray = require("ndarray");

    const base64data = '${base64data}';
    const buffer = new Buffer(base64data, 'base64')
    const aBuffer = new Uint8Array(buffer).buffer;
    const typedArray = NumpyParser.fromArrayBuffer(aBuffer);
    const result = NDArray(typedArray.data, typedArray.shape);

    module.exports = result;
    `;
  } else {
    // emit file and load binary file at runtime
    const outputPath = path.join(options.outputPath, fileName);
    this.emitFile(outputPath, content);

    return `
    const NumpyParser = require("numpy-parser");
    const NDArray = require("ndarray");

    function ajax(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function(e) {
            var buffer = xhr.response; // not responseText
            var result = NumpyParser.fromArrayBuffer(buffer);
            callback(result);
        };
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.send(null);
    }

    module.exports = {
      load: function(callback) {
        ajax("${outputPath}", function(data) {
          const result = NDArray(data.data, data.shape);
          callback(result);
        });
      }
    };
    `;

  }


};
module.exports.raw = true;
