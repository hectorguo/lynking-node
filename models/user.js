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
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    formattedName: {
        type: String,
        required: true,
        unique: true
    },
    linkedinId: {
        type: String,
        required: true,
        unique: true
    },
    headline: {
        type: String,
        required: true
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
    emailAddress: {
        type: String
    },
    numConnections: {
        type: Number
    },
    industry: {
        type: String
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