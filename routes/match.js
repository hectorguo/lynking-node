/** 
 * Express Route: /user
 * @author Hector Guo
 * @version 0.0.3
 */

'use strict';

const express = require('express');
const router = express.Router();

const geoLib = require('geolib');
const User = require('../models/user');
const utils = require('../utils');

const ModelHandle = require('./factory');

const userHandle = new ModelHandle(User, 'User');

// save and get user info
router.route('/user/:linkedinId/match')
    .get((req, res) => {
        const limitCount = req.query.count && req.query.count < 20 ? req.query.count : 20;
        const maxDistance = req.query.distance ? req.query.distance : 1000; // unit meters

        User
        .findOne({ linkedinId: req.params.linkedinId })
        .exec((err, user) => {
            if(err) {
                utils.handleMongooError(err, res);
                return;
            }

            if(!user) {
                utils.reportError(400, 1001, 'user not found', res);
                return;
            }

            User
            .find({
                location: {$near: user.location, $maxDistance: maxDistance/1000/111.12}, // distance 1km square
                linkedinId: {$ne: user.linkedinId}
            })
            // .findNearby()
            .limit(limitCount)
            .exec((err, matchedUsers) => {
                if(err) {
                    utils.handleMongooError(err, res);
                    return;
                }
                // add distance
                matchedUsers = matchedUsers.map((item) => {
                    item._doc.distance = geoLib.getDistance(
                        {latitude: user.location[1], longitude: user.location[0]},
                        {latitude: item.location[1], longitude: item.location[0]}
                        );

                    return item;
                });
                res.status(200).json({users: matchedUsers});
            });
        })
    });

router.route('/user/:linkedinId')
    .get((req, res) => {
        userHandle.model.findOne({
            linkedinId: req.params.linkedinId
        }, (err, user) => {
            if(err) {
                utils.handleMongooError(err, res);
                return;
            }
            
            if(!user) {
                utils.reportError(400, 1001, 'user not found', res);
                return;
            }
            res.status(200).json(user);
        });
    });

module.exports = router;