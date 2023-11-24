"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
const nodeMailerConfigs = {
    username: process.env.MAILER_USERNAME,
    password: process.env.MAILER_PASSWORD,
};
exports.default = nodeMailerConfigs;
