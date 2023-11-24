"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
const apiConfigs = {
    port: process.env.API_PORT,
    accessTokenKey: process.env.API_ACCESS_TOKEN_KEY,
    refreshTokenKey: process.env.API_REFRESH_TOKEN_KEY,
    genOtpSecretKey: process.env.API_GEN_OTP_SECRET_KEY,
};
exports.default = apiConfigs;
