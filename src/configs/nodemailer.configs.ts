import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const nodeMailerConfigs = {
    username: process.env.MAILER_USERNAME,
    password: process.env.MAILER_PASSWORD,
};

export default nodeMailerConfigs;
