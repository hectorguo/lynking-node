'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// {
//     x: 1231.22,
//     y: 122.11,
//     user: 'd71jd81223'
// }

var LocationSchema = new Schema({
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  },
  _user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, { timestamps: true });

LocationSchema.index({ location : '2dsphere' });

module.exports = mongoose.model('Location', LocationSchema);