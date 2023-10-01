import mongoose from 'mongoose';
import { MongoDBConfigs } from '../configs';

const mongodbParty = {
    devConnectionHandler: () => {
        mongoose
            .connect(
                `mongodb+srv://${MongoDBConfigs.username}:${MongoDBConfigs.password}@cluster0.soa8t8w.mongodb.net/${MongoDBConfigs.devEnv}`,
            )
            .then(() => {
                console.log('MongoDB <dev> connection has been established');
            })
            .catch((error) => {
                console.log('MongoDB <dev> connection has something wrong');
            });
    },
    prodConnectionHandler: () => {
        mongoose
            .connect(
                `mongodb+srv://${MongoDBConfigs.username}:${MongoDBConfigs.password}@cluster0.soa8t8w.mongodb.net/${MongoDBConfigs.prodEnv}`,
            )
            .then(() => {
                console.log('MongoDB <prod> connection has been established');
            })
            .catch((error) => {
                console.log('MongoDB <prod> connection has something wrong');
            });
    },
};

export default mongodbParty;
