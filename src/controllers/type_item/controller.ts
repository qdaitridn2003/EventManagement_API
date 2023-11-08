import { Request, Response, NextFunction } from 'express';
import { ItemTypeQuery } from '../../models';
import { createHttpSuccess, paginationHelper, searchHelper } from '../../utils';
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
    const { search, limit, page } = req.query;
    try {
        const { amount, offset } = paginationHelper(limit as string, page as string);
        let listTypeItem;
        if (search) {
            listTypeItem = await ItemTypeQuery.find({ name: { $regex: searchHelper(search as string) } })
                .select({
                    createdAt: false,
                    updatedAt: false,
                    __v: false,
                })
                .limit(amount)
                .skip(offset);
        } else {
            listTypeItem = await ItemTypeQuery.find()
                .select({ createdAt: false, updatedAt: false, __v: false })
                .limit(amount)
                .skip(offset);
        }
        const totalTypeItem = await ItemTypeQuery.countDocuments();
        return next(createHttpSuccess(200, { listTypeItem, totalTypeItem }));
    } catch (error) {
        return next(error);
    }
};
