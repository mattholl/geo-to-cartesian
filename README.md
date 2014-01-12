geo-to-cartesian
================
A small transform stream to convert latitude and longtitude coordinates into Cartesian coordinates

Get it from npm
---------------

    npm install geo-to-cartesian

Pipe in some geographic coordinates
-----------------------------------

```javascript

var geoToCart = require('../index.js');

var geoCoordTextStream = fs.createReadStream(__dirname + '/data.txt');

geo.pipe(geoToCart).pipe();

```

Get some Cartesian ones out
---------------------------

The expected format of the geographic coordinates stream is an array,

    [lat, lon]

Cartesian coordinate bjects are output in the form:

    [x, y, z]

<img src="http://upload.wikimedia.org/wikipedia/commons/7/73/ECEF_ENU_Longitude_Latitude_relationships.svg">
