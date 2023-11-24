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
exports.getListRole = exports.deleteRole = exports.editRole = exports.createRole = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const http_errors_1 = __importDefault(require("http-errors"));
const createRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, identify } = req.body;
    try {
        const result = yield models_1.RoleQuery.create({ name, description, identify });
        next((0, utils_1.createHttpSuccess)(200, result));
    }
    catch (error) {
        next(error);
    }
});
exports.createRole = createRole;
const editRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { name, description, identify } = req.body;
    try {
        const foundRole = yield models_1.RoleQuery.findOne({ _id });
        if (!foundRole) {
            return next((0, http_errors_1.default)(404, 'Not found role'));
        }
        yield models_1.RoleQuery.updateOne({ _id }, { name, description, identify });
        return next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        return next(error);
    }
});
exports.editRole = editRole;
const deleteRole = (req, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const foundRole = yield models_1.RoleQuery.findOne({ _id });
        if (!foundRole) {
            return next((0, http_errors_1.default)(404, 'Not found role'));
        }
        yield models_1.RoleQuery.deleteOne({ _id });
        return next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        return next(error);
    }
});
exports.deleteRole = deleteRole;
const getListRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield models_1.RoleQuery.find({ identify: { $eq: 4 } })
            .select({ createdAt: false, updatedAt: false, __v: false })
            .sort('identify');
        return next((0, utils_1.createHttpSuccess)(200, result));
    }
    catch (error) {
        return next(error);
    }
});
exports.getListRole = getListRole;
