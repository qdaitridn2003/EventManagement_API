import mongoose from 'mongoose';
import { MongoDBConfigs } from '../configs';

const mongodbParty = {
    connectionHandler: () => {
        mongoose
            .connect(MongoDBConfigs.connectionString as string)
            .then(() => {
                console.log('MongoDB connection has been established');
            })
            .catch((error) => {
                console.log('MongoDB connection has something wrong');
            });
    },
};

export default mongodbParty;
