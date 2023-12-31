import { Request, Response, NextFunction } from 'express';
import { CategoryQuery, EventQuery, ItemQuery } from '../../models';
import { createHttpSuccess, paginationHelper, searchHelper } from '../../utils';
import createHttpError from 'http-errors';

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    if (!name) {
        return next(createHttpError(400, 'Category name must be not empty'));
    }

    try {
        const createdCategory = await CategoryQuery.create({ name, description });
        return next(createHttpSuccess(200, { category: createdCategory }));
    } catch (error) {
        return next(error);
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { name, description } = req.body;
    try {
        const foundCategory = await CategoryQuery.findOne({ _id });

        if (!foundCategory) {
            return next(createHttpError(404, 'Not found type item'));
        }

        await CategoryQuery.updateOne({ _id: foundCategory._id }, { name, description });
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundCategory = await CategoryQuery.findOne({ _id });

        if (!foundCategory) {
            return next(createHttpError(404, 'Not found type item'));
        }

        const itemIds = await ItemQuery.find({ category: foundCategory }).select({ _id: true });
        await CategoryQuery.deleteOne({ _id: foundCategory._id });
        await ItemQuery.deleteMany({ category: foundCategory._id });
        await EventQuery.updateMany({ equipments: { $in: itemIds } }, { $pullAll: { equipments: itemIds } });
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};

export const getListCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { search, limit, page } = req.query;
    try {
        const { amount, offset } = paginationHelper(limit as string, page as string);
        const query = CategoryQuery.find()
            .select({ createdAt: false, updatedAt: false, __v: false })
            .sort({ createdAt: 'descending' });

        if (search) {
            query.and([{ name: { $regex: searchHelper(search as string) } }]);
        }

        const totalCategory = await query.clone().countDocuments();
        const listCategory = await query.limit(amount).skip(offset).exec();
        return next(createHttpSuccess(200, { listCategory, totalCategory }));
    } catch (error) {
        return next(error);
    }
};
