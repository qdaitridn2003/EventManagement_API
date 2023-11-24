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
Object.defineProperty(exports, "__esModule", { value: true });
exports.testPaginationWithPopulate = exports.testCheckRole = void 0;
const utils_1 = require("../../utils");
const models_1 = require("../../models");
const testCheckRole = (req, res, next) => {
    const { auth_id, identify } = res.locals;
    return next((0, utils_1.createHttpSuccess)(200, { auth_id, identify }));
};
exports.testCheckRole = testCheckRole;
const testPaginationWithPopulate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const list = yield models_1.EventQuery.find({ name: 'hello' }).populate([
            {
                path: 'employees',
                options: { limit: 10, skip: 1 },
            },
            { path: 'equipment', options: { limit: 10, skip: 1 } },
        ]);
    }
    catch (error) { }
});
exports.testPaginationWithPopulate = testPaginationWithPopulate;
