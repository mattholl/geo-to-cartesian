// The input.txt file contains three objects but only two are tested because the buffer within
// geoToCart transform stream retains the last chunk after a complete object

// https://github.com/jeffbski/pass-stream/blob/master/test/basic.mocha.js

var assert = require('assert');
var geoToCart = require('../index.js');
var fs = require('fs');
var JSONStream = require('JSONStream');

var dataIn = fs.createReadStream(__dirname + '/input.txt');
var dataOut = fs.createWriteStream(__dirname + '/output.txt');

dataIn
    .pipe(geoToCart)
    .pipe(JSONStream.stringify(false))
    .pipe(dataOut);

describe('cartesian results for brighton and tonga', function() {

    var resultParsed = [];

    beforeEach(function(done) {

        dataOut.on('finish', function() {

            var result = fs.readFileSync(__dirname + '/output.txt').toString();

            var lines = result.split(/\n/);

            for(var i = 0; i < lines.length; i++) {
                var obj = JSON.parse(lines[i]);
                resultParsed.push(obj);
            }

            done();
        });
    });

    it('if these are even the right values', function() {
        assert.equal(resultParsed[0][0], 4035587.0474534836);
        assert.equal(resultParsed[0][1], 9248.03731408002);
        assert.equal(resultParsed[0][2], 4922527.464350282);
        assert.equal(resultParsed[1][0], -5948780.075425479);
        assert.equal(resultParsed[1][1], -540303.152057656);
        assert.equal(resultParsed[1][2], -2228731.2513984353);
    });
});