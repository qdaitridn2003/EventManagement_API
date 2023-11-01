import { OtpHandler, TokenHandler } from '../handlers';

export const verifyOTPHelper = (otp: string, otpSecret: string) => {
    const result = OtpHandler.verifyOtp(otpSecret, otp);
    const decodeOtpSecret = TokenHandler.decodeToken(otpSecret);
    return { check: result, auth_id: decodeOtpSecret.auth_id, type: decodeOtpSecret.type };
};
