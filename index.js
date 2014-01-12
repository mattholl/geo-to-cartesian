//  http://en.wikipedia.org/wiki/Map_projection#Projections_by_surface
//  http://en.wikipedia.org/wiki/East_north_up#Conversion_calculations
//  http://en.wikipedia.org/wiki/File:ECEF_ENU_Longitude_Latitude_relationships.svg
//  http://en.wikipedia.org/wiki/Geodetic_system#Geodetic_to.2Ffrom_ECEF_coordinates
//  http://en.wikipedia.org/wiki/File:Latitude_and_Longitude_of_the_Earth.svg
//  http://geographiclib.sourceforge.net/html/other.html#javascript

// http://stackoverflow.com/questions/8981943/lat-long-to-x-y-z-position-in-js-not-working

// http://mathforum.org/library/drmath/view/51832.html

// http://www.movable-type.co.uk/scripts/latlong.html
// http://www.oc.nps.edu/oc2902w/coord/llhxyz.htm

//http://nodejs.org/api/stream.html#stream_object_mode

var stream = require('stream');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

// Approximate radius of the earth 6371km
var R = 6378137.0;

var buffer = '';

var geoToCartesian = new stream.Transform( { objectMode: true } );

geoToCartesian._transform = function (chunk, encoding, done) {

    // http://nodejs.org/api/stream.html#stream_state_objects

    buffer += decoder.write(chunk);
    // split on newlines
    var lines = buffer.split(/\n/);

    // keep the last partial line buffered
    buffer = lines.pop();

    for(var l = 0; l < lines.length; l++) {
        var line = lines[l];

        try {
            var obj = JSON.parse(line);
        } catch(err) {
            this.emit('error', err);
            return;
        }

        var cartesian3D = toECEFEarth(obj.geo[0], obj.geo[1]);

        // push the parsed object out to the readable consumer
        this.push(cartesian3D);
    }

    done();
};

function toECEFEarth(lat, lon) {

    var cosLat = Math.cos(degToRad(lat));
    var sinLat = Math.sin(degToRad(lat));
    var cosLon = Math.cos(degToRad(lon));
    var sinLon = Math.sin(degToRad(lon));

    var f = 1.0 / 298.257224;
    var C = 1.0 / Math.sqrt(cosLat * cosLat + (1 - f) * (1 - f) * sinLat * sinLat);
    var S = (1.0 - f) * (1.0 - f) * C;
    var h = 0.0;

    var x = (R * C + h) * cosLat * cosLon;
    var y = (R * C + h) * cosLat * sinLon;
    var z = (R * S + h) * sinLat;

    return [x, y, z];
}

// Very basic conversion assuming a spherical earth, the transform could be updated to use this.
// Even be passed in as a configuration
function toECEFSphere(lat, lon) {
    var x = R * Math.cos(degToRad(lat)) * Math.cos(degToRad(lon));
    var y = R * Math.cos(degToRad(lat)) * Math.sin(degToRad(lon));
    var z = R * Math.sin(degToRad(lat));

    return [x, y, z];
}

function degToRad(degress) {
    var radians = degress * (Math.PI/180);

    return radians;
}

module.exports = geoToCartesian;