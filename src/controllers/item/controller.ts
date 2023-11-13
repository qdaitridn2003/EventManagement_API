import { Request, Response, NextFunction } from 'express';
import { CategoryQuery, ItemQuery } from '../../models';
import { createHttpSuccess, paginationHelper, searchHelper } from '../../utils';
import createHttpError from 'http-errors';
import { ArrangeConstant, UploadType } from '../../constants';
import { FirebaseParty } from '../../third-party';

export const createInfoItem = async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId, name, description, quantityTotal } = req.body;

    if (!name) {
        return next(createHttpError(400, 'Item name must be not empty'));
    }

    try {
        const createdItem = await ItemQuery.create({
            name,
            category: categoryId,
            description,
            quantityTotal,
        });
        return next(createHttpSuccess(200, { item: createdItem }));
    } catch (error) {
        return next(error);
    }
};

export const updateInfoItem = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { categoryId, name, description, quantityTotal, quantityUsed } = req.body;
    try {
        const foundItem = await ItemQuery.findOne({ _id });
        if (!foundItem) {
            return next(createHttpError(404, 'Not found item'));
        }

        await ItemQuery.updateOne(
            { _id: foundItem._id },
            {
                name,
                category: categoryId,
                description,
                quantityTotal,
                quantityUsed,
                quantityAvailable:
                    (quantityTotal ?? foundItem.quantityTotal) - (quantityUsed ?? foundItem.quantityUsed),
            },
        );
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};

export const deleteInfoItem = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundItem = await ItemQuery.findOne({ _id });
        if (!foundItem) {
            return next(createHttpError(404, 'Not found item'));
        }
        await ItemQuery.deleteOne({ _id: foundItem._id });
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};

export const getDetailItem = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundItem = await ItemQuery.findOne({ _id })
            .populate('category', { _id: true, name: true })
            .select({ createdAt: false, updatedAt: false, __v: false });
        if (!foundItem) {
            return next(createHttpError(404, 'Not found item'));
        }
        return next(createHttpSuccess(200, { item: foundItem }));
    } catch (error) {
        return next(error);
    }
};

export const getListItem = async (req: Request, res: Response, next: NextFunction) => {
    const { limit, page, search, category, available, arrange } = req.query;
    try {
        const { amount, offset } = paginationHelper(limit as string, page as string);
        const query = ItemQuery.find()
            .populate('category', { _id: true, name: true, description: true })
            .select({ createdAt: false, updatedAt: false, __v: false });

        if (search) {
            query.and([{ name: { $regex: searchHelper(search as string) } }]);
        }

        if (category) {
            const parsedCategory = JSON.parse(category as string);
            const listCategory = await CategoryQuery.find({ name: { $in: parsedCategory } }).select({ _id: true });
            query.and([{ category: { $in: listCategory } }]);
        }

        if (available === 'true') {
            query.and([{ quantityAvailable: { $gt: 0 } }]);
        } else if (available === 'false') {
            query.and([{ quantityAvailable: { $lte: 0 } }]);
        }

        if (arrange === ArrangeConstant.HighToLow) {
            query.sort({ quantityAvailable: -1 });
        } else if (arrange === ArrangeConstant.LowToHigh) {
            query.sort({ quantityAvailable: 1 });
        }

        const listItem = await query.limit(amount).skip(offset).exec();
        const totalItem = await query.clone().countDocuments();

        return next(createHttpSuccess(200, { listItem, totalItem }));
    } catch (error) {
        return next(error);
    }
};

export const uploadImageItem = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const image = req.file;
    try {
        const foundItem = await ItemQuery.findOne({ _id });
        if (!foundItem) {
            return next(createHttpError(404, 'Not found item'));
        }
        const imageUrl = await FirebaseParty.uploadImage(image as Express.Multer.File, UploadType.Item);
        await ItemQuery.updateOne({ _id: foundItem._id }, { image: imageUrl });
        return next(createHttpSuccess(200, {}));
    } catch (error) {
        next(error);
    }
};
