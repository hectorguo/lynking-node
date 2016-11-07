'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseHidden = require('mongoose-hidden')({ defaultHidden: { password: true, __v: true } });

const UserSchema = new Schema({
    // token: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // linkedin user name
    name: {
        type: String,
        required: true,
        unique: true
    },
    headline: {
        type: String,
        required: true,
        unique: true
    },
    pictureUrl: {
        type: String,
        required: true,
        unique: true
    },
    profileUrl: {
        type: String,
        required: true
    },
    numConnections: {
        type: Number
    },
    location: {type: [Number], index: '2d'}
});

// define a method to find the nearby person
UserSchema.methods.findNearby = function(cb) {
    return this.model('User').find({
        location: {$near: this.location, $maxDistance: 1/111.12}, // distance 1km square
        name: {$ne: this.name}
    }, cb);
};

// UserSchema.static.findNearby = function(opts, cb) {
//     return this.find({
//         location: {$near: opts.location, $maxDistance: opts.maxDistance/111.12}, // distance 1km square
//         name: {$ne: opts.name}
//     }, cb);
// };

module.exports = mongoose.model('User', UserSchema);