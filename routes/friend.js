/** 
 * Express Route for friend request: /user
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

/**
 * friend request router, with socket.io
 * 
 * @param {Object} io  socket.io instance
 */
module.exports = function() {
  // Get friends
  router.route('/user/:linkedinId/friends')
    .get((req, res) => {
      userHandle.model.findOne({
        linkedinId: req.params.linkedinId
      }, (err, user) => {
        if (err) {
          utils.handleMongooError(err, res);
          return;
        }

        if (!user) {
          utils.reportError(400, 1001, 'user not found', res);
          return;
        }

        // get user's friends
        user.getFriends((err, friends) => {
          if (err) {
            utils.handleMongooError(err, res);
            return;
          }
          res.status(201).json({friends});
        });
      });
    });

  // Create friend request, Accept or Deny friend request
  router.route('/user/:linkedinId/friends/:friendLinkedinId')
    // send a friend request
    .post((req, res) => {
      const senderLinkId = req.params.linkedinId;
      const receiverLinkId = req.params.friendLinkedinId;

      userHandle.model.find({
        linkedinId: { $in: [senderLinkId, receiverLinkId] }
      }, (err, users) => {
        if (err) {
          utils.handleMongooError(err, res);
          return;
        }

        // both users have to be found
        if (!users || users.length !== 2) {
          utils.reportError(400, 1001, 'user not found', res);
          return;
        }

        const sender = users.filter(item => item.linkedinId === senderLinkId)[0];
        const receiver = users.filter(item => item.linkedinId === receiverLinkId)[0];

        // send a friend request by user's _id
        sender.friendRequest(receiver._id, (err, requestRes) => {
          if (err) {
            utils.handleMongooError(err, res);
            return;
          }
          res.status(201).json(requestRes);
          // io.sockets.emit('notification', {
          //   sender: senderLinkId,
          //   receiver: receiverLinkId,
          //   type: 'friendRequest'
          // });
        });
      });
    })
    // Accept or Deny friend request from sender
    .put((req, res) => {
      const receiverLinkId = req.params.linkedinId;
      const senderLinkId = req.params.friendLinkedinId;

      userHandle.model.find({
        linkedinId: { $in: [receiverLinkId, senderLinkId] }
      }, (err, users) => {
        if (err) {
          utils.handleMongooError(err, res);
          return;
        }

        // both users have to be found
        if (!users || users.length !== 2) {
          utils.reportError(400, 1001, 'user not found', res);
          return;
        }

        const sender = users.filter(item => item.linkedinId === senderLinkId)[0];
        const receiver = users.filter(item => item.linkedinId === receiverLinkId)[0];

        // deny or accept request
        if (req.body.action === 'deny') {
          sender.denyRequest(receiver._id, (err, denied) => {
            if (err) {
              utils.handleMongooError(err, res);
              return;
            }
            res.status(200).json(denied);
            // io.sockets.emit('notification', {
            //   sender: senderLinkId,
            //   receiver: receiverLinkId,
            //   type: 'denyRequest'
            // });
          });
        } else {
          sender.acceptRequest(receiver._id, (err, friendship) => {
            if (err) {
              utils.handleMongooError(err, res);
              return;
            }
            res.status(200).json(friendship);
            // io.sockets.emit('notification', {
            //   sender: senderLinkId,
            //   receiver: receiverLinkId,
            //   type: 'acceptRequest'
            // });
          });
        }
      });
    });

  // Get all requests by user. (Sent requests, and received requests)
  router.get('/user/:linkedinId/friends/requests', (req, res) => {
    userHandle.model.findOne({
      linkedinId: req.params.linkedinId
    }, (err, user) => {
      if (err) {
        utils.handleMongooError(err, res);
        return;
      }

      user.getRequests((err, reqList) => {
        if (err) {
          utils.handleMongooError(err, res);
          return;
        }
        res.status(200).json(reqList);
      });
    });
  });

  return router;
}