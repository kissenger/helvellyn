
"use strict"

/**
 * Handles the public interface with the front-end.  Only routes are specified in this module
 * (with some others in app-auth.js) with suppporting functions abstracted to 'app-functions.js'
 */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PolygonDB = require('./schema/polygon-model').Polygon;
const dotenv = require('dotenv').config();

if (dotenv.error) {
  console.log(`ERROR from app.js: ${dotenv.error}`);
  process.exit(0);
}

const app = express();

// apply middleware - note setheaders must come first
// TODO:  (2) to inject /api on routes
app.use( (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Request-With, Content-Type, Accept, Authorization, Content-Disposition");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS");
  next();
});
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.originalUrl}`);
  next();
})


// mongo as a service
// console.log(process.env.MONGODB_PASSWORD)
mongoose.connect(`mongodb+srv://root:${process.env.MONGODB_PASSWORD}@cluster0-5h6di.gcp.mongodb.net/helvellyn?retryWrites=true&w=majority`,
  {useUnifiedTopology: true, useNewUrlParser: true });

mongoose.connection
  .on('error', console.error.bind(console, 'connection error:'))
  .on('close', () => console.log('MongoDB disconnected'))
  .once('open', () => console.log('MongoDB connected') );

app.get('/api/ping/', async (req, res) => {
  res.status(201).json({"hello": "world"});
})

/*****************************************************************
 * store new polygon to database
 ******************************************************************/
app.post('/api/save-polygon/', async (req, res) => {

  const polygon = req.body;

  //first determine if there is an overlap with an existing polygon; if so return error
  try {
    const docs = await PolygonDB.find( { geometry: { $geoIntersects: { $geometry: polygon.geometry} } });

    // if that worked, but returned doc array is not empty, then there was a polygon already there
    if (docs.length > 0) {
      res.status(500).json({myMessage: 'Error saving polygon - Check polygon does not intersect with an existing polygon'});

      //if thats ok, the attempt to save polygon
    } else {
      try {
        const doc = await PolygonDB.create(polygon);
        res.status(200).json(doc);
      } catch (error) {
        res.status(500).json({myMessage: 'Error saving polygon - Unknown error'});
      }
    }

  // if initial query didnt work, the recieved polygon is probably self intersecting
  } catch (error) {
    res.status(500).json({myMessage: 'Error saving polygon - Check polygon is not intersect with itself'});
  }


});

app.get('/api/get-polygons-in-bbox', async (req, res) => {

  const box = { type: 'Polygon', coordinates: bbox2Polygon(req.query.bbox) };

  try {
    const docs = await PolygonDB.find( { geometry: { $geoIntersects: { $geometry: box} } });
    res.status(200).json(docs);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

function bbox2Polygon(bbox) {

  // define a factor
  const factor = 0.95;

  bbox = scaleBox(bbox.map( a => a * 1), factor);
  bbox = checkBoxBounds(bbox)
  bbox = bbox.map(a => limitPrecision(a, 7));

  // return polygon
  return [[
    [ bbox[0], bbox[1] ],
    [ bbox[2], bbox[1] ],
    [ bbox[2], bbox[3] ],
    [ bbox[0], bbox[3] ],
    [ bbox[0], bbox[1] ]
  ]]
}

// factors bbox to with shrink (factor < 1) or grow (factor > 1) box
function scaleBox(bbox, factor) {

  const minLat = bbox[1];
  const maxLat = bbox[3];
  const minLng = bbox[0];
  const maxLng = bbox[2];

  const lngRange = maxLng - minLng;
  const latRange = maxLat - minLat;

  const lngShift = (lngRange - lngRange * factor) / 2;
  const latShift = (latRange - latRange * factor) / 2;

  return [
    minLng < 0 ? minLng - lngShift : minLng + latShift,
    minLat < 0 ? minLat - latShift : minLat + latShift,
    maxLng < 0 ? maxLng + lngShift : maxLng - latShift,
    maxLat < 0 ? maxLat + latShift : maxLat - latShift
  ]


}

// caps lat/lng to ensure no values out of range
function checkBoxBounds(bbox) {
  const minLng = bbox[0] < -180 ? -180 : bbox[0] > 180 ? 180 : bbox[0];
  const minLat = bbox[1] < -90  ? -90  : bbox[1] > 90  ? 90  : bbox[1];
  const maxLng = bbox[2] < -180 ? -180 : bbox[2] > 180 ? 180 : bbox[2];
  const maxLat = bbox[3] < -90  ? -90  : bbox[3] > 90  ? 90  : bbox[3];
  return [minLng, minLat, maxLng, maxLat];
}

// limit value (number) to n decimal places in precision
function limitPrecision(value, precision) {
  let multiplier = Math.pow(10, precision);
  return Math.round( value * multiplier ) / multiplier;
}

module.exports = app;

