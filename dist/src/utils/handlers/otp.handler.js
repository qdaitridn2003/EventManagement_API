"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const speakeasy_1 = __importDefault(require("speakeasy"));
const otpHandler = {
    initOtpSecretKey: () => {
        const initSecretKey = speakeasy_1.default.generateSecret();
        return initSecretKey.base32;
    },
    generateOtp: (otpSecretKey) => {
        const otp = speakeasy_1.default.totp({
            secret: otpSecretKey,
            encoding: 'base32',
            algorithm: 'sha256',
            step: 60,
        });
        return otp;
    },
    verifyOtp: (otpSecretKey, otp) => {
        const resultVerify = speakeasy_1.default.totp.verifyDelta({
            secret: otpSecretKey,
            token: otp,
            encoding: 'base32',
            algorithm: 'sha256',
            step: 60,
            window: 5,
            //window: 2, step: 60 (60 seconds) => window * step = expired otp time
        });
        if ((resultVerify === null || resultVerify === void 0 ? void 0 : resultVerify.delta) === undefined)
            return false;
        else
            return true;
    },
};
exports.default = otpHandler;
