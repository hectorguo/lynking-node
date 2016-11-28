'use strict';
// call the packages we need
const express = require('express');        // call express
const app = express();                 // define our app using express
const bodyParser = require('body-parser');

const cors = require('cors')
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

const linkedin = require('./routes/linkedin');
const user = require('./routes/user');
const location = require('./routes/location');
const match = require('./routes/match');


const corsConfig = {
  origin: function(origin, callback){
    if(origin) {
      origin = origin.replace(/:\d+/, ''); // ignore port
    }
    const originIsWhitelisted = !origin || !!origin.match(/^chrome-extension:/) || conf.corsWhitelist.indexOf(origin) !== -1;
    callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted);
  }
}

app.use(cors(corsConfig));

// Enable CORS
app.use(function(req, res, next) {
  // whiteList
  if(conf.corsWhitelist.indexOf(req.headers.origin) > -1) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/api', user);
app.use('/api', location);
app.use('/api', match);

// combing linkedin APIs
app.use('/api/linkedin', linkedin);

// Authentication
// app.use((req, res, next) => {
//     const token = req.body.token || req.query.token || req.headers['x-access-token'];

//     if(!token) { 
//         utils.reportError(403, 1011, 'No token provided', res);
//         return;
//     }

//     utils.verifyUser(token)
//         .then(() => {
//             next();
//         })
//         .catch((err) => {
//             utils.reportError(403, 1011, 'Failed to authenticate token', res);
//         });
// });

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