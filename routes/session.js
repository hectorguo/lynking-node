/** 
 * Express Route: /sessions
 * @author Hector Guo
 * @version 0.0.3
 */

'use strict';

const express = require('express');
const router = express.Router();

const Session = require('../models/session');
const utils = require('../utils');

const ModelHandle = require('./factory');

const sessionHandle = new ModelHandle(Session, 'Session');

// register - create new user
router.route('/signup')
    .post((req, res) => {
        const promisePassword = utils.hashPassword(req.body.password);
        
        promisePassword
            .then((hashCode) => {
                return sessionHandle.create({
                    username: req.body.username,
                    password: hashCode
                });
            })
            .then((response) => {
                // save db
                res.status(201).json(response).end();
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    });

// login - generate token
router.route('/sessions')
    .post((req, res) => {
        sessionHandle.model.findOne({
            username: req.body.username
        }, (err, user) => {
            if(err) {
                utils.handleMongooError(err, res);
                return;
            }
            if(!user) {
                utils.handleMongooError({
                    kind:'ObjectId',
                    path: req.path
                }, res);
                return;
            }
            utils.verifyPassword(req.body.password, user.password)
                .then(() => utils.signUser(user, {expiresIn: 60}))
                .then((token) => {
                    res.status(200).json({token}).end();
                })
                .catch((err) => {
                    utils.handleMongooError(err, res);
                });
        });
    });

module.exports = router;