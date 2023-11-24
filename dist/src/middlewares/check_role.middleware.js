"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const checkRole = (role) => {
    return (req, res, next) => {
        const { identify } = res.locals;
        if (typeof role === 'object') {
            if (role.includes(identify))
                return next();
        }
        else {
            if (identify === role)
                return next();
        }
        next((0, http_errors_1.default)(401, "You don't have enough permission to do this"));
    };
};
exports.default = checkRole;
