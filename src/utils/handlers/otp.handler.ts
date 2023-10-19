import speakeasy from 'speakeasy';

const otpHandler = {
    initOtpSecretKey: () => {
        const initSecretKey = speakeasy.generateSecret();
        return initSecretKey.base32;
    },
    generateOtp: (otpSecretKey: string) => {
        const otp = speakeasy.totp({
            secret: otpSecretKey,
            encoding: 'base32',
            algorithm: 'sha256',
            step: 60,
        });
        return otp;
    },
    verifyOtp: (otpSecretKey: string, otp: string) => {
        const resultVerify = speakeasy.totp.verifyDelta({
            secret: otpSecretKey,
            token: otp,
            encoding: 'base32',
            algorithm: 'sha256',
            step: 60,
            window: 5,
            //window: 2, step: 60 (60 seconds) => window * step = expired otp time
        });
        if (resultVerify?.delta === undefined) return false;
        else return true;
    },
};

export default otpHandler;
