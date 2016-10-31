'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseHidden = require('mongoose-hidden')({ defaultHidden: { password: true, __v: true } });

const SessionSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Session', SessionSchema);