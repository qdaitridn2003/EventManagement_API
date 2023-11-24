"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPasswordHandler = {
    hashPassword: (password) => {
        const saltRound = bcrypt_1.default.genSaltSync(1);
        const hashPassword = bcrypt_1.default.hashSync(password, saltRound);
        return hashPassword;
    },
    comparePassword: (password, hashPassword) => {
        const resultCompare = bcrypt_1.default.compareSync(password, hashPassword);
        return resultCompare;
    },
};
exports.default = hashPasswordHandler;
