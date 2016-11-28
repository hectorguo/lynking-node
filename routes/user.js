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