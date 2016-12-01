'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const friendsOfFriends = require('friends-of-friends')(mongoose);

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    formattedName: {
        type: String
    },
    linkedinId: {
        type: String,
        required: true,
        unique: true
    },
    headline: {
        type: String
    },
    pictureUrl: {
        type: String
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
    summary: {
        type: String
    },
    location: {type: [Number], index: '2d'}
});

UserSchema.plugin(friendsOfFriends.plugin, { 
    personModelName:            'User',
    friendshipModelName:        'Friendship', 
    friendshipCollectionName:   'userRelationships',
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