"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchHelper = void 0;
const searchHelper = (search) => {
    return new RegExp(`.*${search}.*`, 'i');
};
exports.searchHelper = searchHelper;
