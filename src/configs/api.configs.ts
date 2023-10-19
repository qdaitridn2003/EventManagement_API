import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const apiConfigs = {
    port: process.env.API_PORT,
    accessTokenKey: process.env.API_ACCESS_TOKEN_KEY as string,
    refreshTokenKey: process.env.API_REFRESH_TOKEN_KEY as string,
    genOtpSecretKey: process.env.API_GEN_OTP_SECRET_KEY as string,
};

export default apiConfigs;
