"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandler = (responsePayload, req, res, next) => {
    var _a, _b;
    if (responsePayload instanceof Error) {
        return next(responsePayload);
    }
    else {
        return res
            .status((_a = responsePayload.statusCode) !== null && _a !== void 0 ? _a : 200)
            .json({
            status: 'Success',
            message: (_b = responsePayload.message) !== null && _b !== void 0 ? _b : 'Successfully',
            data: responsePayload.data,
        })
            .flush();
    }
};
exports.default = responseHandler;
