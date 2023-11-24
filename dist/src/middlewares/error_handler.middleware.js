"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const jsonwebtoken_1 = require("jsonwebtoken");
const errorHandler = (errorPayload, req, res, next) => {
    var _a;
    if (errorPayload instanceof zod_1.ZodError) {
        const listErrors = errorPayload.errors;
        const listErrorMessage = listErrors.map((error) => error.message);
        return res
            .status(400)
            .json({
            status: 'failure',
            message: listErrorMessage.length > 1 ? listErrorMessage : listErrorMessage[0],
        })
            .flush();
    }
    else if (errorPayload instanceof jsonwebtoken_1.JsonWebTokenError) {
        if (errorPayload.name === 'TokenExpiredError') {
            return res
                .status(401)
                .json({
                status: 'failure',
                message: 'Your sign in period was expired',
            })
                .flush();
        }
        else {
            return res
                .status(401)
                .json({
                status: 'failure',
                message: 'Invalid token',
            })
                .flush();
        }
    }
    else {
        return res
            .status((_a = errorPayload.statusCode) !== null && _a !== void 0 ? _a : 500)
            .json({
            status: 'failure',
            message: errorPayload.message,
        })
            .flush();
    }
};
exports.default = errorHandler;
