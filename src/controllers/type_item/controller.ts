import { Request, Response, NextFunction } from 'express';
import { ItemTypeQuery } from '../../models';
import { createHttpSuccess } from '../../utils';
import createHttpError from 'http-errors';

export const createTypeItem = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;
    try {
        const createdTypeItem = await ItemTypeQuery.create({ name, description });
        return next(createHttpSuccess(200, { type: createdTypeItem }));
    } catch (error) {
        return next(error);
    }
};

export const updateTypeItem = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { name, description } = req.body;
    try {
        const foundTypeItem = await ItemTypeQuery.findOne({ _id });

        if (!foundTypeItem) {
            return next(createHttpError(400, 'Not found type item'));
        }

        await ItemTypeQuery.updateOne({ _id }, { name, description });
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};

export const deleteTypeItem = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundTypeItem = await ItemTypeQuery.findOne({ _id });

        if (!foundTypeItem) {
            return next(createHttpError(400, 'Not found type item'));
        }

        await ItemTypeQuery.deleteOne({ _id });
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};

export const getListTypeItem = async (req: Request, res: Response, next: NextFunction) => {
    const { search } = req.params;
    try {
        const listTypeItem = await ItemTypeQuery.find({}).select({ createdAt: false, updatedAt: false, __v: false });
    } catch (error) {
        return next(error);
    }
};
