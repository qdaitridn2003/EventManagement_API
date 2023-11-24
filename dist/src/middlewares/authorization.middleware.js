"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const utils_1 = require("../utils");
const authorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    let token;
    if (authorization) {
        if (authorization.includes('Bearer'))
            token = authorization.split(' ')[1];
        else
            token = authorization;
    }
    else {
        return next((0, http_errors_1.default)(500, 'Invalid authorization'));
    }
    try {
        const verifiedToken = yield utils_1.TokenHandler.verifyToken(token, 'access');
        res.locals.auth_id = verifiedToken.auth_id;
        res.locals.identify = verifiedToken.identify;
        res.locals.employee_id = verifiedToken.employee_id;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = authorization;
