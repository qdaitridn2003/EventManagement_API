"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const configs_1 = require("../configs");
const mongodbParty = {
    connectionHandler: () => {
        mongoose_1.default
            .connect(configs_1.MongoDBConfigs.connectionString)
            .then(() => {
            console.log('MongoDB connection has been established');
        })
            .catch((error) => {
            console.log('MongoDB connection has something wrong');
        });
    },
};
exports.default = mongodbParty;
