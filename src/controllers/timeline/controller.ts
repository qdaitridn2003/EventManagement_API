import { Request, Response, NextFunction } from 'express';
import { TimelineQuery } from '../../models';
import { createHttpSuccess, paginationHelper, searchHelper, timestampHelper } from '../../utils';
import createHttpError from 'http-errors';

export const createTimeline = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, dateTime, location } = req.body;
    if (!dateTime) {
        return next(createHttpError(400, 'Timeline dataTime must be not empty '));
    }
    if (!name) {
        return next(createHttpError(400, 'Timeline name must be not empty '));
    }

    try {
        const createTimeline = await TimelineQuery.create({
            name,
            description,
            dateTime: new Date(dateTime),
            location,
        });
        return next(createHttpSuccess(200, { timeline: createTimeline }));
    } catch (error) {
        return next(error);
    }
};
export const updateTimeLine = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { name, description, dataTime, location } = req.body;
    try {
        const foundTimeline = await TimelineQuery.findOne({ _id });
        if (!foundTimeline) {
            return next(createHttpError(404, 'Not found timeline'));
        }
        await TimelineQuery.updateOne({ _id: foundTimeline._id }, { name, description, dataTime, location });
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};
export const deleteTimeline = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundTimeline = await TimelineQuery.findOne({ _id });
        if (!foundTimeline) {
            return next(createHttpError(404, 'Not found timeline'));
        }
        await TimelineQuery.deleteOne({ _id: foundTimeline._id });
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};
export const getListTimeline = async (req: Request, res: Response, next: NextFunction) => {
    const { search, limit, page, dateTime, location } = req.query;

    try {
        const { amount, offset } = paginationHelper(limit as string, page as string);
        const query = TimelineQuery.find()
            .select({ createdAt: false, updatedAt: false, __v: false })
            .sort({ createdAt: 'descending' });

        if (search) {
            query.and([{ name: { $regex: searchHelper(search as string) } }]);
        }
        if (location) {
            query.and([{ location: { $regex: searchHelper(location as string) } }]);
        }
        if (dateTime) {
            const parsedDate = new Date(dateTime as string);
            const { dateStart, dateEnd } = timestampHelper(parsedDate);
            query.and([{ createdAt: { $gte: dateStart, $lt: dateEnd } }]);
        }
        const totalTimeline = await query.clone().countDocuments();
        const listTimeline = await query.limit(amount).skip(offset).exec();
        return next(createHttpSuccess(200, { listTimeline, totalTimeline }));
    } catch (error) {
        return next(error);
    }
};
export const getTimelineDetail = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const timeline = await TimelineQuery.findById(_id).select({ createdAt: false, updatedAt: false, __v: false });
        if (!timeline) {
            return next(createHttpError(400, 'Timeline not found'));
        }
        return next(createHttpSuccess(200, { timeline }));
    } catch (error) {
        return next(error);
    }
};
