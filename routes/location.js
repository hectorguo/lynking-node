/** 
 * Express Route: /location
 * @author Hector Guo
 * @version 0.0.3
 */

'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Location = require('../models/location');
const utils = require('../utils');

const ModelHandle = require('./factory');

const locationHandle = new ModelHandle(Location, 'Location');

// save and get location info
router.route('/user/:name/location')
    .post((req, res) => {
        User.findOne({
            name: req.params.name
        }, (err, user) => {
            if(user) {
                const coord = [req.body.lng, req.body.lat];
                const locationOpts = {
                    location: {
                        type: 'Point',
                        coordinates: coord
                    },
                    _user: user._id
                };

                locationHandle.create(locationOpts)
                    .then((loc) => {
                        // update user's location
                        user.location = coord;
                        user.save((err) => {
                            if(err) {
                                utils.handleMongooError(err, res, 'User');
                                return;
                            }
                            res.status(201).json(loc);
                        });
                    })
                    .catch((err) => {
                        utils.handleMongooError(err, res);
                    });
            } else {
                utils.reportError(400, 1001, 'user not found', res);
            }
        });
    })
    // test api
    .get((req, res) => {
        User
        .findOne({ name: req.params.name })
        .exec(function (err, user) {
            if (err) {
                return utils.handleMongooError(err, res);
            }
            // get location by _id
            Location
            .find({ _user: user._id })
            .exec((err, loc) => {
                if (err) {
                    return utils.handleMongooError(err, res);
                }
                res.status(200).json(loc);
            });
        });
    });

module.exports = router;