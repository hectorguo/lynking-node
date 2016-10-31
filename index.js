'use strict';
// call the packages we need
const express = require('express');        // call express
const app = express();                 // define our app using express
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const conf = require('./config');
const port = process.env.PORT || 8080;        // set our port
const MONGO_URL = conf.database;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(MONGO_URL);

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();              // get an instance of the express Router

const utils = require('./utils');

const session = require('./routes/session');

// setup and sessions router do not need to verify token
app.use('/api', session);

// Authentication
app.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(!token) { 
        utils.reportError(403, 1011, 'No token provided', res);
        return;
    }

    utils.verifyUser(token)
        .then(() => {
            next();
        })
        .catch((err) => {
            utils.reportError(403, 1011, 'Failed to authenticate token', res);
        });
});

// router for entities
// app.use('/api', location);


// router for browser test
// app.use('/test', express.static('test/browser'));

// handle 404 resource
app.use((req, res, next) => {
    next();
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Service running on port ' + port);

module.exports = app;