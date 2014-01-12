var geoToCart = require('../index.js');
var fs = require('fs');
var JSONStream = require('JSONStream');

var geo = fs.createReadStream(__dirname + '/data.txt');

geo.pipe(geoToCart).pipe(JSONStream.stringify(false)).pipe(process.stdout);