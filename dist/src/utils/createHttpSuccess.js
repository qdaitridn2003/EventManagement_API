"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createHttpSuccess = (statusCode, data, message) => {
    return {
        data: data !== null && data !== void 0 ? data : {},
        statusCode: statusCode !== null && statusCode !== void 0 ? statusCode : 200,
        message: message !== null && message !== void 0 ? message : 'You have successfully',
    };
};
exports.default = createHttpSuccess;
