"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseConfigs = exports.NodeMailerConfigs = exports.MongoDBConfigs = exports.ApiConfigs = void 0;
var api_configs_1 = require("./api.configs");
Object.defineProperty(exports, "ApiConfigs", { enumerable: true, get: function () { return __importDefault(api_configs_1).default; } });
var mongodb_configs_1 = require("./mongodb.configs");
Object.defineProperty(exports, "MongoDBConfigs", { enumerable: true, get: function () { return __importDefault(mongodb_configs_1).default; } });
var nodemailer_configs_1 = require("./nodemailer.configs");
Object.defineProperty(exports, "NodeMailerConfigs", { enumerable: true, get: function () { return __importDefault(nodemailer_configs_1).default; } });
var firebase_configs_1 = require("./firebase.configs");
Object.defineProperty(exports, "FirebaseConfigs", { enumerable: true, get: function () { return __importDefault(firebase_configs_1).default; } });
