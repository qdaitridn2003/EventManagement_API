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
exports.getListPayment = exports.getDetailPayment = exports.deletePayment = exports.updatePayment = void 0;
const models_1 = require("../../models");
const http_errors_1 = __importDefault(require("http-errors"));
const utils_1 = require("../../utils");
const updatePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { totalPayment, initialPayment, discount, status, methodPayment, note } = req.body;
    try {
        const foundPayment = yield models_1.PaymentQuery.findById(_id);
        if (!foundPayment) {
            return next((0, http_errors_1.default)(404, 'Not found payment'));
        }
        const remainingPayment = ((totalPayment ? parseFloat(totalPayment) : foundPayment.totalPayment) -
            (initialPayment ? parseFloat(initialPayment) : foundPayment.initialPayment)) *
            (0, utils_1.discountHandleHelper)(discount !== null && discount !== void 0 ? discount : foundPayment.discount);
        yield models_1.PaymentQuery.updateOne({ _id: foundPayment._id }, {
            totalPayment,
            initialPayment,
            remainingPayment,
            discount,
            status,
            methodPayment,
            note,
        });
        next((0, utils_1.createHttpSuccess)(200, {}));
    }
    catch (error) {
        next(error);
    }
});
exports.updatePayment = updatePayment;
const deletePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const foundPayment = yield models_1.PaymentQuery.findById(_id);
        if (!foundPayment) {
            return next((0, http_errors_1.default)(404, 'Not found payment'));
        }
        yield models_1.PaymentQuery.deleteOne({ _id: foundPayment._id });
        next((0, utils_1.createHttpSuccess)(200, {}));
    }
    catch (error) {
        next(error);
    }
});
exports.deletePayment = deletePayment;
const getDetailPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const foundPayment = yield models_1.PaymentQuery.findById(_id);
        if (!foundPayment) {
            return next((0, http_errors_1.default)(404, 'Not found payment'));
        }
        next((0, utils_1.createHttpSuccess)(200, { payment: foundPayment }));
    }
    catch (error) {
        next(error);
    }
});
exports.getDetailPayment = getDetailPayment;
const getListPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, status, methodPayment } = req.query;
    try {
        const { amount, offset } = (0, utils_1.paginationHelper)(limit, page);
        const query = models_1.PaymentQuery.find().select({ createdAt: false, updatedAt: false, __v: false });
        if (status) {
            const parseStatus = JSON.parse(status);
            query.and([{ status: { $in: parseStatus } }]);
        }
        if (methodPayment) {
            const parseMethodPayment = JSON.parse(methodPayment);
            query.and([{ methodPayment: { $in: parseMethodPayment } }]);
        }
        const totalPayment = yield query.clone().countDocuments();
        const listPayment = yield query.limit(amount).skip(offset).exec();
        next((0, utils_1.createHttpSuccess)(200, { listPayment, totalPayment }));
    }
    catch (error) {
        next(error);
    }
});
exports.getListPayment = getListPayment;
