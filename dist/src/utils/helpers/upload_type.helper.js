"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadTypeHelper = void 0;
const constants_1 = require("../../constants");
const uploadTypeHelper = (type) => {
    switch (type) {
        case constants_1.UploadType.Avatar:
            return 'avatars';
        case constants_1.UploadType.Attachment:
            return 'attachments';
        case constants_1.UploadType.Event:
            return 'events';
        case constants_1.UploadType.Item:
            return 'items';
        case constants_1.UploadType.Transport:
            return 'transports';
        default:
            return '';
    }
};
exports.uploadTypeHelper = uploadTypeHelper;
