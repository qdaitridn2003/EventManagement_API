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
exports.uploadAvatarClient = exports.getListClient = exports.getClientDetail = exports.deleteClient = exports.updateInfoClient = exports.createInfoClient = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const http_errors_1 = __importDefault(require("http-errors"));
const third_party_1 = require("../../third-party");
const constants_1 = require("../../constants");
const createInfoClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fullName, dateOfBirth, gender, phoneNumber, address } = req.body;
    const validator = utils_1.OtherValidator.registerInfoValidator.safeParse({ email, gender, phoneNumber });
    if (!validator.success) {
        return next(validator.error);
    }
    try {
        yield models_1.ClientQuery.create({
            email,
            fullName,
            phoneNumber,
            address,
            dataOfBirth: new Date(dateOfBirth),
            gender,
        });
        return next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        return next(error);
    }
});
exports.createInfoClient = createInfoClient;
const updateInfoClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { email, fullName, dateOfBirth, gender, phoneNumber, address } = req.body;
    try {
        const foundClient = yield models_1.ClientQuery.findOne({ _id });
        if (!foundClient) {
            return next((0, http_errors_1.default)(404, 'Not found client'));
        }
        yield models_1.ClientQuery.updateOne({ _id: foundClient._id }, { email, fullName, phoneNumber, address, dateOfBirth, gender });
        return next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        return next(error);
    }
});
exports.updateInfoClient = updateInfoClient;
const deleteClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const foundClient = yield models_1.ClientQuery.findOne({ _id });
        if (!foundClient) {
            return next((0, http_errors_1.default)(404, 'Not found client'));
        }
        yield models_1.ClientQuery.deleteOne({ _id: foundClient._id });
        return next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        return next(error);
    }
});
exports.deleteClient = deleteClient;
const getClientDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const client = yield models_1.ClientQuery.findById(_id).select({ createdAt: false, updatedAt: false, __v: false });
        if (!client) {
            return next((0, http_errors_1.default)(400, 'Client not found'));
        }
        return next((0, utils_1.createHttpSuccess)(200, { client }));
    }
    catch (error) {
        return next(error);
    }
});
exports.getClientDetail = getClientDetail;
const getListClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, search } = req.query;
    try {
        const { amount, offset } = (0, utils_1.paginationHelper)(limit, page);
        const query = models_1.ClientQuery.find()
            .populate({
            path: 'contracts',
            select: { createdAt: false, updatedAt: false, __v: false },
            populate: {
                path: 'payment',
                select: { createdAt: false, updatedAt: false, __v: false },
            },
        })
            .select({ createdAt: false, updatedAt: false, __v: false });
        if (search) {
            query.and([
                {
                    $or: [
                        { fullName: { $regex: (0, utils_1.searchHelper)(search) } },
                        { email: { $regex: (0, utils_1.searchHelper)(search) } },
                    ],
                },
            ]);
        }
        const totalClient = yield query.clone().countDocuments();
        const listClient = yield query.limit(amount).skip(offset).exec();
        return next((0, utils_1.createHttpSuccess)(200, { listClient, totalClient }));
    }
    catch (error) {
        return next(error);
    }
});
exports.getListClient = getListClient;
const uploadAvatarClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const avatar = req.file;
    const { _id } = req.params;
    try {
        const foundClient = yield models_1.ClientQuery.findOne({ _id });
        if (!foundClient) {
            return next((0, http_errors_1.default)(404, 'Not found client'));
        }
        const avatarUrl = yield third_party_1.FirebaseParty.uploadImage(avatar, constants_1.UploadType.Avatar);
        yield models_1.ClientQuery.updateOne({ _id: foundClient._id }, { avatar: avatarUrl });
        return next((0, utils_1.createHttpSuccess)(200, {}));
    }
    catch (error) {
        next(error);
    }
});
exports.uploadAvatarClient = uploadAvatarClient;
