import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const mongoDBConfigs = {
    connectionString: process.env.MONGODB_CONNECTION_STRING,
};

export default mongoDBConfigs;
