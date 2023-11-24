"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const timeHandler = {
    checkExpireDate: (date) => {
        const parsedDate = moment_1.default.unix(date);
        const oneHourAgo = (0, moment_1.default)().subtract(1, 'hours');
        const result = parsedDate.isAfter(oneHourAgo);
        return result;
    },
};
exports.default = timeHandler;
