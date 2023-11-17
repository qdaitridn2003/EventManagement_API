import { Request, Response, NextFunction } from 'express';
import { ServiceQuery } from '../../models';
import { createHttpSuccess, paginationHelper, searchHelper } from '../../utils';
import createHttpError from 'http-errors';

export const createService = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    if (!name) {
        return next(createHttpError(400, 'Service name must be not empty'));
    }

    try {
        const createService = await ServiceQuery.create({ name, description });
        return next(createHttpSuccess(200, { service: createService }));
    } catch (error) {
        return next(error);
    }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { name, description } = req.body;
    try {
        const foundService = await ServiceQuery.findOne({ _id });

        if (!foundService) {
            return next(createHttpError(404, 'Not found service'));
        }
        await ServiceQuery.updateOne({ _id: foundService._id }, { name, description });
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundService = await ServiceQuery.findOne({ _id });

        if (!foundService) {
            return next(createHttpError(404, 'Not found service'));
        }
        await ServiceQuery.deleteOne({ _id: foundService._id });
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};

export const getListService = async (req: Request, res: Response, next: NextFunction) => {
    const { search, limit, page } = req.query;
    try {
        const { amount, offset } = paginationHelper(limit as string, page as string);
        const query = ServiceQuery.find().select({ createdAt: false, updatedAt: false, __v: false });

        if (search) {
            query.and([{ name: { $regex: searchHelper(search as string) } }]);
        }
        const totalService = await query.clone().countDocuments();
        const listService = await query.limit(amount).skip(offset).exec();
        return next(createHttpSuccess(200, { listService, totalService }));
    } catch (error) {
        return next(error);
    }
};
export const getServiceDetail = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const service = await ServiceQuery.findById(_id).select({ createdAt: false, updatedAt: false, __v: false });
        if (!service) {
            return next(createHttpError(400, 'Service not found'));
        }
        return next(createHttpSuccess(200, { service }));
    } catch (error) {
        return next(error);
    }
};
