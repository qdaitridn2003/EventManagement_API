import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const mongoDBConfigs = {
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
    devEnv: process.env.MONGODB_DEV_ENV,
    prodEnv: process.env.MONGODB_PROD_ENV,
};

export default mongoDBConfigs;
