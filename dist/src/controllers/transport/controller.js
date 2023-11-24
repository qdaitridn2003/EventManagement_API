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
exports.uploadImageTransport = exports.getTransportDetail = exports.getListTransport = exports.deleteTransport = exports.updateTransport = exports.createTransport = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const http_errors_1 = __importDefault(require("http-errors"));
const third_party_1 = require("../../third-party");
const constants_1 = require("../../constants");
const createTransport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { employee: employeeId, event: eventId, licensePlate, status, name, brand, color, availability } = req.body;
    try {
        const employeeResult = yield models_1.EmployeeQuery.findOne({ _id: employeeId })
            .populate({
            path: 'auth',
            select: { _id: true, role: true },
            populate: {
                path: 'role',
                select: { _id: true, name: true },
            },
        })
            .select({ createdAt: false, updatedAt: false, __v: false });
        if (!employeeResult || !employeeResult.auth) {
            return next((0, http_errors_1.default)(400, 'Employee has no auth information'));
        }
        const authEmployee = employeeResult.auth;
        if (!authEmployee || typeof authEmployee !== 'object' || !('role' in authEmployee)) {
            return next((0, http_errors_1.default)(400, 'Invalid auth information in employee '));
        }
        const roleId = authEmployee.role;
        if (!roleId) {
            return next((0, http_errors_1.default)(400, 'Role has no auth information'));
        }
        const roleResult = yield models_1.RoleQuery.findOne({ _id: roleId });
        if (!roleResult || roleResult.name !== 'Tài Xế') {
            return next((0, http_errors_1.default)(400, 'Employee is not a driver'));
        }
        const createTransport = yield models_1.TransportQuery.create({
            employee: employeeResult._id,
            licensePlate,
            status,
            name,
            brand,
            color,
            availability,
        });
        return next((0, utils_1.createHttpSuccess)(200, { transport: createTransport }));
    }
    catch (error) {
        return next(error);
    }
});
exports.createTransport = createTransport;
const updateTransport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { employee: employeeId, event: eventId, licensePlate, status, name, brand, color, availability } = req.body;
    try {
        const foundTransport = yield models_1.TransportQuery.findOne({ _id });
        if (!foundTransport) {
            return next((0, http_errors_1.default)(404, 'Not found transport'));
        }
        const employeeResult = yield models_1.EmployeeQuery.findOne({ _id: employeeId })
            .populate({
            path: 'auth',
            select: { _id: true, role: true },
            populate: {
                path: 'role',
                select: { _id: true, name: true },
            },
        })
            .select({ createdAt: false, updatedAt: false, __v: false });
        if (!employeeResult) {
            throw (0, http_errors_1.default)(400, 'Invalid employee ID');
        }
        const authEmployee = employeeResult.auth;
        if (!authEmployee || typeof authEmployee !== 'object' || !('role' in authEmployee)) {
            throw (0, http_errors_1.default)(400, 'Invalid auth information in employee');
        }
        const roleId = authEmployee.role;
        if (!roleId) {
            throw (0, http_errors_1.default)(400, 'Role has no auth information');
        }
        const roleResult = yield models_1.RoleQuery.findOne({ _id: roleId });
        if (!roleResult || roleResult.name !== 'Tài Xế') {
            throw (0, http_errors_1.default)(400, 'Employee is not a driver');
        }
        yield models_1.TransportQuery.updateOne({ _id: foundTransport._id }, {
            employee: employeeResult._id,
            licensePlate,
            status,
            name,
            brand,
            color,
            availability,
        });
        return next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        return next(error);
    }
});
exports.updateTransport = updateTransport;
const deleteTransport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const foundTransport = yield models_1.TransportQuery.findOne({ _id });
        if (!foundTransport) {
            return next((0, http_errors_1.default)(404, 'Not found transport'));
        }
        yield models_1.TransportQuery.deleteOne({ _id: foundTransport._id });
        return next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        return next(error);
    }
});
exports.deleteTransport = deleteTransport;
const getListTransport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, limit, page, color, brand, licensePlate } = req.query;
    try {
        const { amount, offset } = (0, utils_1.paginationHelper)(limit, page);
        const query = models_1.TransportQuery.find().select({ createdAt: false, updatedAt: false, __v: false });
        if (search) {
            query.and([{ name: { $regex: (0, utils_1.searchHelper)(search) } }]);
        }
        if (color) {
            query.and([{ color: { $regex: (0, utils_1.searchHelper)(color) } }]);
        }
        if (brand) {
            query.and([{ brand: { $regex: (0, utils_1.searchHelper)(brand) } }]);
        }
        if (licensePlate) {
            query.and([{ licensePlate: { $regex: (0, utils_1.searchHelper)(licensePlate) } }]);
        }
        const totalTimeline = yield query.clone().countDocuments();
        const listTimeline = yield query.limit(amount).skip(offset).exec();
        return next((0, utils_1.createHttpSuccess)(200, { listTimeline, totalTimeline }));
    }
    catch (error) { }
});
exports.getListTransport = getListTransport;
const getTransportDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const transport = yield models_1.TransportQuery.findById(_id).select({ createdAt: false, updatedAt: false, __v: false });
        if (!transport) {
            return next((0, http_errors_1.default)(400, 'Transport not found'));
        }
        return next((0, utils_1.createHttpSuccess)(200, { transport }));
    }
    catch (error) {
        return next(error);
    }
});
exports.getTransportDetail = getTransportDetail;
const uploadImageTransport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const image = req.file;
    const { _id } = req.params;
    try {
        const foundTransport = yield models_1.TransportQuery.findOne({ _id });
        if (!foundTransport) {
            return next((0, http_errors_1.default)(404, 'Not found transport'));
        }
        const imageUrl = yield third_party_1.FirebaseParty.uploadImage(image, constants_1.UploadType.Transport);
        yield models_1.TransportQuery.updateOne({ _id: foundTransport._id }, { image: imageUrl });
        return next((0, utils_1.createHttpSuccess)(200, {}));
    }
    catch (error) {
        return next(error);
    }
});
exports.uploadImageTransport = uploadImageTransport;
