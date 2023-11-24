"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTPHelper = void 0;
const handlers_1 = require("../handlers");
const verifyOTPHelper = (otp, otpSecret) => {
    const result = handlers_1.OtpHandler.verifyOtp(otpSecret, otp);
    const decodeOtpSecret = handlers_1.TokenHandler.decodeToken(otpSecret);
    return { check: result, auth_id: decodeOtpSecret.auth_id, type: decodeOtpSecret.type };
};
exports.verifyOTPHelper = verifyOTPHelper;
