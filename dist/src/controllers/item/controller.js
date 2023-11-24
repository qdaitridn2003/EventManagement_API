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
exports.uploadImageItem = exports.getListItem = exports.getDetailItem = exports.deleteInfoItem = exports.updateInfoItem = exports.createInfoItem = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const http_errors_1 = __importDefault(require("http-errors"));
const constants_1 = require("../../constants");
const third_party_1 = require("../../third-party");
const createInfoItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId, name, description, quantityTotal } = req.body;
    if (!name) {
        return next((0, http_errors_1.default)(400, 'Item name must be not empty'));
    }
    try {
        const createdItem = yield models_1.ItemQuery.create({
            name,
            category: categoryId,
            description,
            quantityTotal,
        });
        return next((0, utils_1.createHttpSuccess)(200, { item: createdItem }));
    }
    catch (error) {
        return next(error);
    }
});
exports.createInfoItem = createInfoItem;
const updateInfoItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { categoryId, name, description, quantityTotal, quantityUsed } = req.body;
    try {
        const foundItem = yield models_1.ItemQuery.findOne({ _id });
        if (!foundItem) {
            return next((0, http_errors_1.default)(404, 'Not found item'));
        }
        yield models_1.ItemQuery.updateOne({ _id: foundItem._id }, {
            name,
            category: categoryId,
            description,
            quantityTotal,
            quantityUsed,
            quantityAvailable: (quantityTotal !== null && quantityTotal !== void 0 ? quantityTotal : foundItem.quantityTotal) - (quantityUsed !== null && quantityUsed !== void 0 ? quantityUsed : foundItem.quantityUsed),
        });
        return next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        return next(error);
    }
});
exports.updateInfoItem = updateInfoItem;
const deleteInfoItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const foundItem = yield models_1.ItemQuery.findOne({ _id });
        if (!foundItem) {
            return next((0, http_errors_1.default)(404, 'Not found item'));
        }
        yield models_1.ItemQuery.deleteOne({ _id: foundItem._id });
        return next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        return next(error);
    }
});
exports.deleteInfoItem = deleteInfoItem;
const getDetailItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const foundItem = yield models_1.ItemQuery.findOne({ _id })
            .populate('category', { _id: true, name: true })
            .select({ createdAt: false, updatedAt: false, __v: false });
        if (!foundItem) {
            return next((0, http_errors_1.default)(404, 'Not found item'));
        }
        return next((0, utils_1.createHttpSuccess)(200, { item: foundItem }));
    }
    catch (error) {
        return next(error);
    }
});
exports.getDetailItem = getDetailItem;
const getListItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, search, category, available, arrange } = req.query;
    try {
        const { amount, offset } = (0, utils_1.paginationHelper)(limit, page);
        const query = models_1.ItemQuery.find()
            .populate('category', { _id: true, name: true, description: true })
            .select({ createdAt: false, updatedAt: false, __v: false });
        if (search) {
            query.and([{ name: { $regex: (0, utils_1.searchHelper)(search) } }]);
        }
        if (category) {
            const parsedCategory = JSON.parse(category);
            const listCategory = yield models_1.CategoryQuery.find({ name: { $in: parsedCategory } }).select({ _id: true });
            query.and([{ category: { $in: listCategory } }]);
        }
        if (available === 'true') {
            query.and([{ quantityAvailable: { $gt: 0 } }]);
        }
        else if (available === 'false') {
            query.and([{ quantityAvailable: { $lte: 0 } }]);
        }
        if (arrange === constants_1.ArrangeConstant.Descending) {
            query.sort({ quantityAvailable: -1 });
        }
        else if (arrange === constants_1.ArrangeConstant.Ascending) {
            query.sort({ quantityAvailable: 1 });
        }
        const totalItem = yield query.clone().countDocuments();
        const listItem = yield query.limit(amount).skip(offset).exec();
        return next((0, utils_1.createHttpSuccess)(200, { listItem, totalItem }));
    }
    catch (error) {
        return next(error);
    }
});
exports.getListItem = getListItem;
const uploadImageItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const image = req.file;
    try {
        const foundItem = yield models_1.ItemQuery.findOne({ _id });
        if (!foundItem) {
            return next((0, http_errors_1.default)(404, 'Not found item'));
        }
        const imageUrl = yield third_party_1.FirebaseParty.uploadImage(image, constants_1.UploadType.Item);
        yield models_1.ItemQuery.updateOne({ _id: foundItem._id }, { image: imageUrl });
        return next((0, utils_1.createHttpSuccess)(200, {}));
    }
    catch (error) {
        next(error);
    }
});
exports.uploadImageItem = uploadImageItem;
