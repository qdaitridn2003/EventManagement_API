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
exports.getTimelineDetail = exports.getListTimeline = exports.deleteTimeline = exports.updateTimeLine = exports.createTimeline = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const http_errors_1 = __importDefault(require("http-errors"));
const createTimeline = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, dateTime, location } = req.body;
    if (!dateTime) {
        return next((0, http_errors_1.default)(400, 'Timeline dataTime must be not empty '));
    }
    if (!name) {
        return next((0, http_errors_1.default)(400, 'Timeline name must be not empty '));
    }
    try {
        const createTimeline = yield models_1.TimelineQuery.create({
            name,
            description,
            dateTime: new Date(dateTime),
            location,
        });
        return next((0, utils_1.createHttpSuccess)(200, { timeline: createTimeline }));
    }
    catch (error) {
        return next(error);
    }
});
exports.createTimeline = createTimeline;
const updateTimeLine = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { name, description, dataTime, location } = req.body;
    try {
        const foundTimeline = yield models_1.TimelineQuery.findOne({ _id });
        if (!foundTimeline) {
            return next((0, http_errors_1.default)(404, 'Not found timeline'));
        }
        yield models_1.TimelineQuery.updateOne({ _id: foundTimeline._id }, { name, description, dataTime, location });
        return next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        return next(error);
    }
});
exports.updateTimeLine = updateTimeLine;
const deleteTimeline = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const foundTimeline = yield models_1.TimelineQuery.findOne({ _id });
        if (!foundTimeline) {
            return next((0, http_errors_1.default)(404, 'Not found timeline'));
        }
        yield models_1.TimelineQuery.deleteOne({ _id: foundTimeline._id });
        return next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        return next(error);
    }
});
exports.deleteTimeline = deleteTimeline;
const getListTimeline = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, limit, page, dateTime, location } = req.query;
    try {
        const { amount, offset } = (0, utils_1.paginationHelper)(limit, page);
        const query = models_1.TimelineQuery.find().select({ createdAt: false, updatedAt: false, __v: false });
        if (search) {
            query.and([{ name: { $regex: (0, utils_1.searchHelper)(search) } }]);
        }
        if (location) {
            query.and([{ location: { $regex: (0, utils_1.searchHelper)(location) } }]);
        }
        if (dateTime) {
            const parsedDate = new Date(dateTime);
            const { dateStart, dateEnd } = (0, utils_1.timestampHelper)(parsedDate);
            query.and([{ createdAt: { $gte: dateStart, $lt: dateEnd } }]);
        }
        const totalTimeline = yield query.clone().countDocuments();
        const listTimeline = yield query.limit(amount).skip(offset).exec();
        return next((0, utils_1.createHttpSuccess)(200, { listTimeline, totalTimeline }));
    }
    catch (error) {
        return next(error);
    }
});
exports.getListTimeline = getListTimeline;
const getTimelineDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const timeline = yield models_1.TimelineQuery.findById(_id).select({ createdAt: false, updatedAt: false, __v: false });
        if (!timeline) {
            return next((0, http_errors_1.default)(400, 'Timeline not found'));
        }
        return next((0, utils_1.createHttpSuccess)(200, { timeline }));
    }
    catch (error) {
        return next(error);
    }
});
exports.getTimelineDetail = getTimelineDetail;
