/** 
 * Express Route: /location
 * @author Hector Guo
 * @version 0.0.3
 */

'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const ChatToken = require('../models/chatToken');
const utils = require('../utils');

const ModelHandle = require('./factory');
const ChatTokenHandle = new ModelHandle(ChatToken, 'ChatToken');

//Firebase 
var admin = require("firebase-admin");
admin.initializeApp({
   credential: admin.credential.cert({
    projectId: "lynking-33fb0",
    clientEmail: "firebase-adminsdk-w7rye@lynking-33fb0.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEwAIBADANBgkqhkiG9w0BAQEFAASCBKowggSmAgEAAoIBAQDSy2amrh1NE/Nw\nglfOzuiWHC765adXSuxrxFjKQfWa/8xZlgwGtskch/1ZGV7cAZiIhHYbzDxyWxO3\n85Hzw3EuLjhE0pPUukYZObEeyGE6QC6gPpfGMOEmXMuV+4M9Y/0IdcggJPaR+Vex\nVnwmT/ftEUMUrkPzfFODV1FbGApmWbBQo/vbpypWt1Rg+Sk4OSZS43vbIX7vaHz9\nWbne3Pdo0343+DPgNLaP4TJW8XjU0ebmEi/2KZQ28lDm9KL2eLohk8TMx9CWU0r6\nEOCAt+QrJRl5JH7RrQxrkYgKhiUNE6O0mZVaiZwSr1dnpWFUtaNg9NiEbaqV5FWj\nUeeKCDkNAgMBAAECggEBANFuRyHJkdEXxmF9DvKpPgqOG9spOraO+RAlNzZUjEmg\nZg6H9pDhIDUZo4vXmhip+TuBp7r8kv3nIVM9S0BOaO/B+iPeuAO9wpGjcSetXHQ8\nela5eZ/uxnOP9LGh/wWKh0bVhqzxLI1hl0/ZJmYGQ8Qkx2oPrfGHD45Jvcnsu8Bt\nBAORgpp3k6wzbl7gLWTVuANR0fGggYuilCa+DZ4k4p2D46EHvNoUz6sld136zFlC\nCn7pJ0NAcX+TdjgqXoTnrf5D3WhX47cyFMuopJU3gFR2h1NsOtAF9X2xjIz3A5+Z\nPU6RpSNRQBcThiRJS+Z3THNwaHeo2qrvTW1CWpomNH0CgYEA7JQrUrc/mpx6alGI\n/crxXYBxm/5vMUPHouLMiRdTY6rAu36UZFenCs3+3zzG8a+33E/LUYpJvF8l1OV0\nHUDc8FO22BVSEYlKwxBQkc/tNfkG8nL1ng3pU3DW89+L2C/QBhI5VwwKI8nMNjcl\nTG8XZezlLIcahPHolzFbu0RM5M8CgYEA5Blcn6S7bCeupmtdhFYtf4pR3bWxaAQE\nx25gfpDevrWrXr5EgOvXEEcFLS0NkffuAxTse+auDdL5ja4UFtsqpfWw4EKreMPP\nvxgwmf9dbR+hv613u+mef/XcfvdukGI3b5qCStxHWibFJGwIAk8kZzhWIH/FXgtk\npGliN/CBs2MCgYEAjkV82D2DboNzysRF0fpdtJEtwVX9oG7We8pQnpD8gQ+K4DZ7\nHuznc8P15mIycd3uf/sslljHhxThN2rVrVH4jD6L0t7ff9REtZH2Ifoc+TxNRTiF\nJQvQqXFOk1J4UwZN35jOCt8eqe8Nc/0t3Q1h0NXp7CFDfXfNHD9+ntuwMlkCgYEA\nqrWwdGo9OryYIUTJQHmeo41Jp7yLgWVAjmE1JoQVsHUWRFnxuurGkhAU97J4LX54\nSyYltrT2HrJ+wmI99r0gNgSi07QR0Nf7avEXrqlHqpu52lJhAeneDbZbx0o3HSfk\nhUoFqTEi1X2enZucgt3oSLgI/VmixLeSItob//GnoDECgYEAxtLWnwqqP6wPMtHu\nzmOai9dC2vO9CBlE9IMmFcNECxZBIpXWzfdGV0vsrdNzguW8uwxXOMTpnt3aeSG/\nt4+/qFPQZ0z6c0r3kOZgEo1ZLsvxaLG/XrU+VgeErUVcO+3IDQlAVb+qhkEVGSQe\nJr4AMn6FppsuDlOlDkw+mQYNQHQ=\n-----END PRIVATE KEY-----\n"
  }),
  databaseURL: "https://lynking-33fb0.firebaseio.com"
});


// save and get location info
router.route('/user/:linkedinId/chatToken')
    .post((req, res) => {
        User.findOne({
            linkedinId: req.params.linkedinId
        }, (err, user) => {
            if(user) {
                const chatOpts = {
                    chatToken: "",
                    _user: user._id,
                    linkedinId:req.params.linkedinId 
                };
                console.log(chatOpts)
                //Create Only one Chat Token
                admin.auth().createCustomToken(chatOpts.linkedinId)
                  .then(function(customToken) {
                        chatOpts.chatToken = customToken;
                        //console.log(chatOpts);
                        //Delete old tokens
                        ChatToken.find({linkedinId:req.params.linkedinId}).remove({},(err)=>{
                            ChatTokenHandle.create(chatOpts)
                                .then((obj) => {
                                    res.status(201).json(obj);
                                })
                                .catch((err) => {
                                    utils.handleMongooError(err, res);
                                });
                        });
                        
                  })
                  .catch(function(error) {
                    console.log("Error creating custom token:", error);
                  });
            } else {
                utils.reportError(400, 1001, 'user not found', res);
            }
        });
    })
    // test api
    .get((req, res) => {
        User
        .findOne({ linkedinId: req.params.linkedinId })
        .exec(function (err, user) {
            if (err) {
                return utils.handleMongooError(err, res);
            }
            // get location by _id
            ChatToken
            .findOne({ _user: user._id })
            .exec((err, obj) => {
                if (err) {
                    return utils.handleMongooError(err, res);
                }
                if(obj.length<1)
                    utils.reportError(400, 1001, 'Chat token not found', res);
                else
                    res.status(200).json(obj);
            });
        });
    });

module.exports = router;