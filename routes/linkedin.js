/** 
 * Express Route: /session
 * @author Hector Guo
 * @version 0.0.3
 */

'use strict';

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const User = require('../models/user');
const utils = require('../utils');

const ModelHandle = require('./factory');

const userHandle = new ModelHandle(User, 'User');

/**
 * Get token from Linkedin
 * 
 * @param {object} params 
 * {
 * grant_type: 'authorization_code',
 * code: code,
 * redirect_uri: 'http://localhost:8000',
 * client_id: '81xcrsa3u39vr4',
 * client_secret: '2P3itf8w1G5kgnY9'
 * }
 * @returns
 */
function getToken(params) {
  const tokenURL = 'https://www.linkedin.com/oauth/v2/accessToken';

  let formData = '';
  for (let i in params) {
    formData += `${i}=${encodeURIComponent(params[i])}&`;
  }
  formData = formData.slice(0, -1);

  return fetch(tokenURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData
  })
    .then(result => result.json());
}

/**
 * Get profile from linkedin
 * 
 * @param {string} token
 * @returns
 */
function getProfile(token) {
  const params = [
    'id',
    'first-name',
    'last-name',
    'formatted-name',
    'email-address',
    'num-connections',
    'headline',
    'picture-urls::(original)',
    'industry',
    'summary',
    'public-profile-url'
  ];
  const profileURL = `https://api.linkedin.com/v1/people/~:(${params.join(',')})?format=json`;
  return fetch(profileURL, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(result => result.json())
}

// login - generate token
router.route('/token')
  .get((req, res) => {
    getToken(req.query)
      .then((session) => {
        res.status(200).json(session)
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });

router.route('/profile')
  .get((req, res) => {
    getProfile(req.query.token)
    .then((profile) => {
      res.status(200).json(profile);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
  })
  .post((req, res) => {
    getProfile(req.query.token)
    .then((profile) => {
      const userParams = {
        "linkedinId": profile.id,
        "firstName": profile.firstName,
        "lastName": profile.lastName,
        "formattedName": profile.formattedName,
        "headline": profile.headline,
        "numConnections": profile.numConnections,
        "pictureUrl": profile.pictureUrls ? profile.pictureUrls.values[0] : '',
        "profileUrl": profile.publicProfileUrl,
        "emailAddress": profile.emailAddress,
        "industry": profile.industry,
        "summary": profile.summary
      }

      // if user found, just return user. 
      // if not found, create new one and return it.
      userHandle.model.findOne({
        linkedinId: profile.id
      }, (err, user) => {
        if(!err && user) {
          res.status(200).json(user);
          return;
        }

        userHandle.create(userParams)
        .then((user) => {
          res.status(201).json(user);
        })
        .catch((err) => {
          utils.handleMongooError(err, res);
        });
      });
      
    })
  })

module.exports = router;