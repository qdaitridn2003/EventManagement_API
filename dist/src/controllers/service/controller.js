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
exports.getServiceDetail = exports.getListService = exports.deleteService = exports.updateService = exports.createService = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const http_errors_1 = __importDefault(require("http-errors"));
const createService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    if (!name) {
        return next((0, http_errors_1.default)(400, 'Service name must be not empty'));
    }
    try {
        const createService = yield models_1.ServiceQuery.create({ name, description });
        return next((0, utils_1.createHttpSuccess)(200, { service: createService }));
    }
    catch (error) {
        return next(error);
    }
});
exports.createService = createService;
const updateService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { name, description } = req.body;
    try {
        const foundService = yield models_1.ServiceQuery.findOne({ _id });
        if (!foundService) {
            return next((0, http_errors_1.default)(404, 'Not found service'));
        }
        yield models_1.ServiceQuery.updateOne({ _id: foundService._id }, { name, description });
        return next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        return next(error);
    }
});
exports.updateService = updateService;
const deleteService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const foundService = yield models_1.ServiceQuery.findOne({ _id });
        if (!foundService) {
            return next((0, http_errors_1.default)(404, 'Not found service'));
        }
        yield models_1.ServiceQuery.deleteOne({ _id: foundService._id });
        return next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        return next(error);
    }
});
exports.deleteService = deleteService;
const getListService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, limit, page } = req.query;
    try {
        const { amount, offset } = (0, utils_1.paginationHelper)(limit, page);
        const query = models_1.ServiceQuery.find().select({ createdAt: false, updatedAt: false, __v: false });
        if (search) {
            query.and([{ name: { $regex: (0, utils_1.searchHelper)(search) } }]);
        }
        const totalService = yield query.clone().countDocuments();
        const listService = yield query.limit(amount).skip(offset).exec();
        return next((0, utils_1.createHttpSuccess)(200, { listService, totalService }));
    }
    catch (error) {
        return next(error);
    }
});
exports.getListService = getListService;
const getServiceDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const service = yield models_1.ServiceQuery.findById(_id).select({ createdAt: false, updatedAt: false, __v: false });
        if (!service) {
            return next((0, http_errors_1.default)(400, 'Service not found'));
        }
        return next((0, utils_1.createHttpSuccess)(200, { service }));
    }
    catch (error) {
        return next(error);
    }
});
exports.getServiceDetail = getServiceDetail;
