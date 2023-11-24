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
exports.getListCategory = exports.deleteCategory = exports.updateCategory = exports.createCategory = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const http_errors_1 = __importDefault(require("http-errors"));
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    if (!name) {
        return next((0, http_errors_1.default)(400, 'Category name must be not empty'));
    }
    try {
        const createdCategory = yield models_1.CategoryQuery.create({ name, description });
        return next((0, utils_1.createHttpSuccess)(200, { category: createdCategory }));
    }
    catch (error) {
        return next(error);
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { name, description } = req.body;
    try {
        const foundCategory = yield models_1.CategoryQuery.findOne({ _id });
        if (!foundCategory) {
            return next((0, http_errors_1.default)(404, 'Not found type item'));
        }
        yield models_1.CategoryQuery.updateOne({ _id: foundCategory._id }, { name, description });
        return next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        return next(error);
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const foundCategory = yield models_1.CategoryQuery.findOne({ _id });
        if (!foundCategory) {
            return next((0, http_errors_1.default)(404, 'Not found type item'));
        }
        yield models_1.CategoryQuery.deleteOne({ _id: foundCategory._id });
        return next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        return next(error);
    }
});
exports.deleteCategory = deleteCategory;
const getListCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, limit, page } = req.query;
    try {
        const { amount, offset } = (0, utils_1.paginationHelper)(limit, page);
        const query = models_1.CategoryQuery.find().select({ createdAt: false, updatedAt: false, __v: false });
        if (search) {
            query.and([{ name: { $regex: (0, utils_1.searchHelper)(search) } }]);
        }
        const totalCategory = yield query.clone().countDocuments();
        const listCategory = yield query.limit(amount).skip(offset).exec();
        return next((0, utils_1.createHttpSuccess)(200, { listCategory, totalCategory }));
    }
    catch (error) {
        return next(error);
    }
});
exports.getListCategory = getListCategory;
