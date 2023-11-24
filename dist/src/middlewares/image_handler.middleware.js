"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const multer_1 = __importDefault(require("multer"));
const imageHandler = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: (req, file, callBack) => {
        const tailImageFile = file.mimetype.split('/')[1];
        if (tailImageFile === 'jpg' || tailImageFile === 'jpeg' || tailImageFile === 'png' || tailImageFile === 'svg') {
            callBack(null, true);
        }
        else {
            callBack((0, http_errors_1.default)(400, 'Image must have tail file (jpg, jpeg, png, or svg)'));
        }
    },
    limits: {
        fieldSize: 100 * 1000, //0.1MB 100KB
    },
});
exports.default = imageHandler;
