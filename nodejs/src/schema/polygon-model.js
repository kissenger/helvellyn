const mongoose = require('mongoose');

const polygonSchema = new mongoose.Schema({

  type: {type: String},
  geometry: {
    type: {type: String, required: true},
    coordinates: {type: [[[Number]]], required: true}
  },
  properties: {
    createdByUserId: {type: String},
    createdByUserName: {type: String},
    creationDate: {type: Date, default: Date.now},
    polygonName: {type: String},
    status: [{
      userId: {type: String},
      userName: {type: String},
      status: {type: String},
      timestamp: {type: Date},
      displayColour: {type: String},

    }]
  }
});

polygonSchema.index({ geometry: "2dsphere" });

const Polygon = mongoose.model('polygon', polygonSchema);

module.exports = {
  Polygon
}
