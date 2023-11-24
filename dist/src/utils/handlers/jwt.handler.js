"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("../../configs");
const jwtHandler = {
    signToken: (payload, signature) => {
        if (signature === 'access') {
            return new Promise((resolve, reject) => {
                jsonwebtoken_1.default.sign(payload, configs_1.ApiConfigs.accessTokenKey, {
                    algorithm: 'HS256',
                    expiresIn: '1h',
                }, (error, token) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(token);
                    }
                });
            });
        }
        else if (signature === 'refresh') {
            return new Promise((resolve, reject) => {
                jsonwebtoken_1.default.sign(payload, configs_1.ApiConfigs.refreshTokenKey, {
                    algorithm: 'HS256',
                }, (error, token) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(token);
                    }
                });
            });
        }
        else if (signature === 'otp_secret') {
            return new Promise((resolve, reject) => {
                jsonwebtoken_1.default.sign(payload, configs_1.ApiConfigs.genOtpSecretKey, {
                    algorithm: 'HS256',
                    expiresIn: '5m',
                }, (error, token) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(token);
                    }
                });
            });
        }
        else {
            throw new Error('Invalid signature');
        }
    },
    verifyToken: (token, signature) => {
        if (signature === 'access') {
            return new Promise((resolve, reject) => {
                jsonwebtoken_1.default.verify(token, configs_1.ApiConfigs.accessTokenKey, (error, decode) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(decode);
                    }
                });
            });
        }
        else if (signature === 'refresh') {
            return new Promise((resolve, reject) => {
                jsonwebtoken_1.default.verify(token, configs_1.ApiConfigs.refreshTokenKey, (error, decode) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(decode);
                    }
                });
            });
        }
        else if (signature === 'otp_secret') {
            return new Promise((resolve, reject) => {
                jsonwebtoken_1.default.verify(token, configs_1.ApiConfigs.genOtpSecretKey, (error, decode) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(decode);
                    }
                });
            });
        }
        else {
            throw new Error('Invalid signature');
        }
    },
    decodeToken: (token) => {
        return jsonwebtoken_1.default.decode(token);
    },
};
exports.default = jwtHandler;
