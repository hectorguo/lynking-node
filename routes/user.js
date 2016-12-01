/** 
 * Express Route: /user
 * @author Hector Guo
 * @version 0.0.3
 */

'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const utils = require('../utils');

const ModelHandle = require('./factory');

const userHandle = new ModelHandle(User, 'User');

// save and get user info
router.route('/user')
    .post((req, res) => {
        userHandle.create(req.body)
            .then((user) => {
                res.status(201).json(user);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    })
    // test api
    .get((req, res) => {
        userHandle.get()
            .then((users) => {
                res.status(200).json({users: users});
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    });

// Get and remove one user by linkedinId
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
    })
    .delete((req, res) => {
        userHandle.model.remove({linkedinId: req.params.linkedinId},
        (err, item) => {
            if(err) {
                utils.handleMongooError(err, res);
                return;
            }
            res.status(200).json({
                message: `${req.params.linkedinId} has been removed`
            });
        });
    });

// Create friend request and Get friends
router.route('/user/:linkedinId/friends')
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

            // get user's friends
            user.getFriends((err, friends) => {
                if(err) {
                    utils.handleMongooError(err, res);
                    return;
                }
                res.status(201).json(friends);
            });
        });
    });

// Create friend request, Accept or Deny friend request
router.route('/user/:linkedinId/friends/:friendLinkedinId')
    // send a friend request
    .post((req, res) => {
        const senderLinkId = req.params.linkedinId;
        const responserLinkId = req.params.friendLinkedinId;

        userHandle.model.find({
            linkedinId: {$in: [senderLinkId, responserLinkId]}
        }, (err, users) => {
            if(err) {
                utils.handleMongooError(err, res);
                return;
            }
            
            // both users have to be found
            if(!users || users.length !== 2) {
                utils.reportError(400, 1001, 'user not found', res);
                return;
            }

            const sender = users.filter(item => item.linkedinId === senderLinkId)[0];
            const responser = users.filter(item => item.linkedinId === responserLinkId)[0];
            
            // send a friend request by user's _id
            sender.friendRequest(responser._id, (err, requestRes) => {
                if(err) {
                    utils.handleMongooError(err, res);
                    return;
                }
                res.status(201).json(requestRes);
            });
        });
    })
    // Accept or Deny friend request from sender
    .put((req, res) => {
        const responserLinkId = req.params.linkedinId;
        const senderLinkId = req.params.friendLinkedinId;

        userHandle.model.find({
            linkedinId: {$in: [responserLinkId, senderLinkId]}
        }, (err, users) => {
            if(err) {
                utils.handleMongooError(err, res);
                return;
            }
            
            // both users have to be found
            if(!users || users.length !== 2) {
                utils.reportError(400, 1001, 'user not found', res);
                return;
            }

            const sender = users.filter(item => item.linkedinId === senderLinkId)[0];
            const responser = users.filter(item => item.linkedinId === responserLinkId)[0];

            // deny or accept request
            if(req.body.action === 'deny') {
                sender.denyRequest(responser._id, (err, denied) => {
                    if(err) {
                        utils.handleMongooError(err, res);
                        return;
                    }
                    res.status(200).json(denied);
                });
            } else {
                sender.acceptRequest(responser._id, (err, friendship) => {
                    if(err) {
                        utils.handleMongooError(err, res);
                        return;
                    }
                    res.status(200).json(friendship);
                });
            }
        });
    });

router.get('/user/:linkedinId/friends/requests', (req, res) => {
    userHandle.model.findOne({
            linkedinId: req.params.linkedinId
        }, (err, user) => {
            if(err) {
                utils.handleMongooError(err, res);
                return;
            }
            
            user.getRequests((err, reqList) => {
                if(err) {
                    utils.handleMongooError(err, res);
                    return;
                }
                res.status(200).json(reqList);
            });
        });
});

module.exports = router;