'use strict';

const conf = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * report error with http standard
 * 
 * @param {Number} statusCode
 * @param {Number} errorCode
 * @param {String} errorMessage
 * @param {Object} res Express's response object
 */
function reportError(statusCode, errorCode, errorMessage, res) {
    res
        .status(statusCode)
        .json({
            errorCode,
            errorMessage,
            requestTime: Date.now()
        })
        .end();
}

/**
 * get a standard error info
 * 
 * @param {String} type Mongoose's error type
 * @param {String} source
 * @param {String} msg
 * @returns 
 * {
 *  errorCode: Number
 *  errorMessage: String
 *  statusCode: Number
 * }
 */
function getErrorInfo(type, source, msg) {
    const errorType = {
        'notvalid': {errorCode: 1001, statusCode: 500, errorMessage: msg ? msg: `${source} is not valid` },
        'required': {errorCode: 1002, statusCode: 400, errorMessage: msg ? msg: `${source} required` },
        'typeError': {errorCode: 1003, statusCode: 400, errorMessage: msg ? msg: `${source} type error` },
        'empty': {errorCode: 1004, statusCode: 400, errorMessage: msg ? msg: 'empty body' },
        'format': {errorCode: 1005, statusCode: 400, errorMessage: msg ? msg: 'data format error' },
        'notValidAttr': {errorCode: 1006, statusCode: 400, errorMessage: msg ? msg: `attribute ${source} is not valid` },
        'noId': {errorCode: 1007, statusCode: 400, errorMessage: msg ? msg: 'Id should not be provided' },
        'duplicated': {errorCode: 1008, statusCode: 400, errorMessage: msg ? msg: `${source} duplicated` },
        'user defined': {errorCode: 1009, statusCode: 400, errorMessage: msg ? msg: `${source} is not unique` },
        'ObjectId': {errorCode: 1010, statusCode: 404, errorMessage: msg ? msg: `resouce ${source} not found`},
        'maxlength': {errorCode: 1001, statusCode: 400, errorMessage: msg ? msg: `longer than the maximum allowed length`},
        'minlength': {errorCode: 1001, statusCode: 400, errorMessage: msg ? msg: `shorter than the minimum allowed length`},
    };

    return errorType[type] ? errorType[type] : {
        errorCode: 9999,
        errorMessage: msg ? msg: `unknow error`,
        statusCode: 400
    };
};

/**
 * report error message based on Mongoose error object
 * 
 * @param {Object} err - Mongoose Error
 * @param {Object} res - express response object
 * @param {String} source - Source Name
 */
function handleMongooError(err, res, source) {
    let errorInfo; 
    const detailErrors = err.errors;

    if (err && err.kind) {
        errorInfo = getErrorInfo(err.kind, err.path, err.message);
    } else if (detailErrors) {
        for(let errName in detailErrors) {
            if(detailErrors.hasOwnProperty(errName)) {
                errorInfo = getErrorInfo(detailErrors[errName].kind, errName, detailErrors[errName].message);
            }
        }
    } else {
        // custom error
        errorInfo = {
            statusCode: 400,
            errorCode: 1001,
            errorMessage: err.message
        }
    }
    reportError(errorInfo.statusCode, errorInfo.errorCode, errorInfo.errorMessage, res);
};
    
function throwIfMissing(param) {
    throw new Error(`${param} required`);
};

/**
 * hash passord for saving in database
 * 
 * @param {string} plainPassword
 * @returns Promise Object
 */
function hashPassword(plainPassword) {
    return new Promise((resolve, reject) => {
        const saltRounds = 5;
        bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
            if(err) {
                reject(err);
            }
            resolve(hash);
        });
    });
}

/**
 * veirty password with hash
 * 
 * @param {string} plainPasword
 * @param {string} hash
 * @returns Promise Object
 */
function verifyPassword(plainPasword, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPasword, hash, (err, isEqual) => {
            if(err) {
                reject(err);
            }
            if(!isEqual) {
                reject({result: isEqual, message: 'wrong password'})
            }
            resolve(hash);
        });
    });
}

/**
 * Generate token by user's name and password
 * 
 * @param {object} user 
 * {
 * username: 'hectorguo',
 * password: '12345'
 * }
 * @param {object} options jwt options
 * @returns Promise Object
 */
function signUser(user, options) {
    return new Promise((resolve, reject) => {
        const secret = conf.secret;
        jwt.sign(user, secret, options, (err, token) => {
            if(err) {
                reject(err);
            }
            resolve(token);
        });
    });

}

/**
 * verify token
 * 
 * @param {string} token
 * @returns Promise object
 */
function verifyUser(token) {
    return new Promise((resolve, reject) => {
        const secret = conf.secret;
        jwt.verify(token, secret, (err, decoded) => {
            if(err) {
                reject(err);
            }
            resolve(decoded);
        });

    });
}

module.exports = {
    reportError,
    handleMongooError,
    throwIfMissing,
    hashPassword,
    verifyPassword,
    verifyUser,
    signUser,
}