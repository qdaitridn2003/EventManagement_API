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
exports.uploadEmployeeAvatar = exports.getEmployeeList = exports.getEmployeeProfile = exports.updateEmployeeProfile = exports.registerEmployeeProfile = void 0;
const utils_1 = require("../../utils");
const models_1 = require("../../models");
const third_party_1 = require("../../third-party");
const constants_1 = require("../../constants");
const http_errors_1 = __importDefault(require("http-errors"));
const registerEmployeeProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authId, fullName, dateOfBirth, gender, phoneNumber, address } = req.body;
    const validator = utils_1.OtherValidator.registerInfoValidator.safeParse({ gender, phoneNumber });
    if (!validator.success) {
        return next(validator.error);
    }
    try {
        const foundAccount = yield models_1.AuthQuery.findOne({ _id: authId });
        if (!foundAccount) {
            return next((0, http_errors_1.default)(404, 'Not found account'));
        }
        const createdEmployee = yield models_1.EmployeeQuery.create({
            auth: authId,
            email: foundAccount.username,
            fullName,
            phoneNumber,
            address,
            dateOfBirth: new Date(dateOfBirth),
        });
        return next((0, utils_1.createHttpSuccess)(200, { employee: createdEmployee }));
    }
    catch (error) {
        return next(error);
    }
});
exports.registerEmployeeProfile = registerEmployeeProfile;
const updateEmployeeProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { employee_id } = res.locals;
    const { email, fullName, dateOfBirth, gender, phoneNumber, address } = req.body;
    const validator = utils_1.OtherValidator.registerInfoValidator.safeParse({ email, gender, phoneNumber });
    if (!validator.success) {
        return next(validator.error);
    }
    try {
        const foundEmployee = yield models_1.EmployeeQuery.findOne({ _id: employee_id });
        if (!foundEmployee) {
            return next((0, http_errors_1.default)(404, 'Not found employee'));
        }
        yield models_1.EmployeeQuery.updateOne({ _id: foundEmployee._id }, { email, fullName, dateOfBirth, gender, phoneNumber, address });
        return next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        return next(error);
    }
});
exports.updateEmployeeProfile = updateEmployeeProfile;
const getEmployeeProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { employee_id } = res.locals;
    const { _id } = req.params;
    try {
        const foundEmployee = yield models_1.EmployeeQuery.findOne({ _id: _id ? _id : employee_id })
            .populate({
            path: 'auth',
            select: { _id: true, username: true, role: true },
            match: { verifiedAt: { $nin: [null] }, isVerified: { $eq: true } },
            populate: {
                path: 'role',
                select: { _id: true, name: true },
            },
        })
            .populate({
            path: 'contract',
            select: { createdAt: false, updatedAt: false, __v: false },
            populate: {
                path: 'payment',
                select: { createdAt: false, updatedAt: false, __v: false },
            },
        })
            .select({ createdAt: false, updatedAt: false, __v: false });
        if (!foundEmployee) {
            return next((0, http_errors_1.default)(404, 'Not found employee'));
        }
        return next((0, utils_1.createHttpSuccess)(200, { employee: foundEmployee }));
    }
    catch (error) {
        return next(error);
    }
});
exports.getEmployeeProfile = getEmployeeProfile;
const getEmployeeList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, role, limit, page } = req.query;
    try {
        const { amount, offset } = (0, utils_1.paginationHelper)(limit, page);
        const query = models_1.EmployeeQuery.find()
            .populate({
            path: 'auth',
            select: { _id: true, username: true, role: true },
            match: { verifiedAt: { $nin: [null] }, isVerified: { $eq: true } },
            populate: {
                path: 'role',
                select: { _id: true, name: true },
            },
        })
            .populate({
            path: 'contract',
            select: { createdAt: false, updatedAt: false, __v: false },
            populate: {
                path: 'payment',
                select: { createdAt: false, updatedAt: false, __v: false },
            },
        })
            .select({ createdAt: false, updatedAt: false, __v: false });
        if (search) {
            query.and([{ fullName: { $regex: (0, utils_1.searchHelper)(search) } }]);
        }
        if (role) {
            const parseRole = JSON.parse(role);
            const listRole = yield models_1.RoleQuery.find({ name: { $in: parseRole } }).select({ _id: true });
            const listAuth = yield models_1.AuthQuery.find({ role: { $in: listRole } }).select({ _id: true });
            query.and([{ auth: { $in: listAuth } }]);
        }
        const totalEmployee = yield query.clone().countDocuments();
        const listEmployee = yield query.limit(amount).skip(offset).exec();
        return next((0, utils_1.createHttpSuccess)(200, { listEmployee, totalEmployee }));
    }
    catch (error) {
        return next(error);
    }
});
exports.getEmployeeList = getEmployeeList;
const uploadEmployeeAvatar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const avatar = req.file;
    const { employee_id } = res.locals;
    try {
        const foundEmployee = yield models_1.EmployeeQuery.findOne({ _id: employee_id });
        if (!foundEmployee) {
            return next((0, http_errors_1.default)(404, 'Not found employee'));
        }
        const avatarUrl = yield third_party_1.FirebaseParty.uploadImage(avatar, constants_1.UploadType.Avatar);
        yield models_1.EmployeeQuery.updateOne({ _id: foundEmployee._id }, { avatar: avatarUrl });
        return next((0, utils_1.createHttpSuccess)(200, {}));
    }
    catch (error) {
        next(error);
    }
});
exports.uploadEmployeeAvatar = uploadEmployeeAvatar;
