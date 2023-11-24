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
exports.getListContract = exports.getDetailContract = exports.deleteContract = exports.updateContract = exports.createContract = void 0;
const models_1 = require("../../models");
const http_errors_1 = __importDefault(require("http-errors"));
const utils_1 = require("../../utils");
const createContract = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, startDate, endDate, status, contractNote, attachments, initialPayment, totalPayment, discount, methodPayment, paymentNote, employeeId, clientId, } = req.body;
    if (!name) {
        return next((0, http_errors_1.default)(400, 'Contract name must be not empty'));
    }
    if (!employeeId) {
        return next((0, http_errors_1.default)(400, 'Employee must be have'));
    }
    if (!clientId) {
        return next((0, http_errors_1.default)(400, 'Client must be have'));
    }
    try {
        const remainingPayment = parseFloat(totalPayment) - parseFloat(initialPayment) * (0, utils_1.discountHandleHelper)(discount);
        const createdPayment = yield models_1.PaymentQuery.create({
            initialPayment,
            remainingPayment,
            totalPayment,
            discount,
            methodPayment,
            note: paymentNote,
        });
        const createdContract = yield models_1.ContractQuery.create({
            payment: createdPayment._id,
            name,
            startDate,
            endDate,
            status,
            note: contractNote,
            attachments: attachments && JSON.parse(attachments),
        });
        yield models_1.EmployeeQuery.updateOne({ _id: employeeId }, { contract: createdContract._id });
        yield models_1.ClientQuery.updateOne({ _id: clientId }, { $push: { contracts: createdContract._id } });
        next((0, utils_1.createHttpSuccess)(200, { contract: createdContract }));
    }
    catch (error) {
        next(error);
    }
});
exports.createContract = createContract;
const updateContract = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { name, startDate, endDate, status, note, attachments } = req.body;
    try {
        const foundContract = yield models_1.ContractQuery.findOne({ _id });
        if (!foundContract) {
            return next((0, http_errors_1.default)(404, 'Not found contract'));
        }
        yield models_1.ContractQuery.updateOne({ _id: foundContract._id }, {
            name,
            startDate,
            endDate,
            status,
            note,
            attachments: attachments ? JSON.parse(attachments) : foundContract.attachments,
        });
        next((0, utils_1.createHttpSuccess)(200, {}));
    }
    catch (error) {
        next(error);
    }
});
exports.updateContract = updateContract;
const deleteContract = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const foundContract = yield models_1.ContractQuery.findOne({ _id });
        if (!foundContract) {
            return next((0, http_errors_1.default)(404, 'Not found contract'));
        }
        yield models_1.EmployeeQuery.updateMany({ contract: foundContract._id }, { contract: null });
        yield models_1.ClientQuery.updateMany({ contracts: foundContract }, { $pull: { contracts: foundContract._id } });
        yield models_1.ContractQuery.deleteOne({ _id });
        yield models_1.PaymentQuery.deleteOne({ _id: foundContract.payment });
        next((0, utils_1.createHttpSuccess)(200, {}));
    }
    catch (error) {
        next(error);
    }
});
exports.deleteContract = deleteContract;
const getDetailContract = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const foundContract = yield models_1.ContractQuery.findOne({ _id })
            .populate('payment', { createdAt: false, updatedAt: false, __v: false })
            .select({
            createdAt: false,
            updatedAt: false,
            __v: false,
        });
        if (!foundContract) {
            return next((0, http_errors_1.default)(404, 'Not found contract'));
        }
        const foundEmployee = yield models_1.EmployeeQuery.findOne({ contract: foundContract._id }).select({
            _id: true,
            fullName: true,
            avatar: true,
        });
        const foundClient = yield models_1.ClientQuery.findOne({ contracts: foundContract }).select({
            _id: true,
            fullName: true,
            avatar: true,
        });
        next((0, utils_1.createHttpSuccess)(200, {
            contract: foundContract,
            employee: foundEmployee,
            client: foundClient,
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.getDetailContract = getDetailContract;
const getListContract = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, limit, page, startDate, endDate, status } = req.query;
    try {
        const query = models_1.ContractQuery.find()
            .populate('payment', { createdAt: false, updatedAt: false, __v: false })
            .select({ createdAt: false, updatedAt: false, __v: false });
        if (search) {
            query.and([{ name: { $regex: (0, utils_1.searchHelper)(search) } }]);
        }
        if (status) {
            const parsedStatus = JSON.parse(status);
            query.and([{ status: { $in: parsedStatus } }]);
        }
        if (startDate && endDate) {
            const startTimestamp = (0, utils_1.timestampHelper)(new Date(startDate));
            const endTimestamp = (0, utils_1.timestampHelper)(new Date(endDate));
            const nowTimestamp = (0, utils_1.timestampHelper)(new Date());
            if (startDate !== endDate) {
                query.and([
                    { startDate: { $gte: startTimestamp.dateStart } },
                    { endDate: { $lt: endTimestamp.dateEnd } },
                ]);
            }
            else if (startDate === endDate) {
                query.and([
                    { startDate: { $gte: startTimestamp.dateStart } },
                    { endDate: { $lt: nowTimestamp.dateEnd } },
                ]);
            }
        }
        const { amount, offset } = (0, utils_1.paginationHelper)(limit, page);
        const totalContract = yield query.clone().countDocuments();
        const listContract = yield query.limit(amount).skip(offset).exec();
        next((0, utils_1.createHttpSuccess)(200, { listContract, totalContract }));
    }
    catch (error) {
        next(error);
    }
});
exports.getListContract = getListContract;
