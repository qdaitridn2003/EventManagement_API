import { Request, Response, NextFunction } from 'express';
import { PaymentQuery } from '../../models';
import createHttpError from 'http-errors';
import { createHttpSuccess, discountHandleHelper, paginationHelper, searchHelper } from '../../utils';

export const updatePayment = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { totalPayment, initialPayment, discount, status, methodPayment, note } = req.body;
    try {
        const foundPayment = await PaymentQuery.findById(_id);
        if (!foundPayment) {
            return next(createHttpError(404, 'Not found payment'));
        }
        const discountAmount =
            (totalPayment ? parseFloat(totalPayment) : foundPayment.totalPayment) *
            discountHandleHelper(discount ? discount : foundPayment.discount);
        const remainingPayment =
            (totalPayment ? parseFloat(totalPayment) : foundPayment.totalPayment) -
            (initialPayment ? parseFloat(initialPayment) : foundPayment.initialPayment) -
            discountAmount;
        await PaymentQuery.updateOne(
            { _id: foundPayment._id },
            {
                totalPayment,
                initialPayment,
                remainingPayment,
                discount,
                status,
                methodPayment,
                note,
            },
        );
        next(createHttpSuccess(200, {}));
    } catch (error) {
        next(error);
    }
};

export const deletePayment = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundPayment = await PaymentQuery.findById(_id);
        if (!foundPayment) {
            return next(createHttpError(404, 'Not found payment'));
        }
        await PaymentQuery.deleteOne({ _id: foundPayment._id });
        next(createHttpSuccess(200, {}));
    } catch (error) {
        next(error);
    }
};

export const getDetailPayment = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundPayment = await PaymentQuery.findById(_id);
        if (!foundPayment) {
            return next(createHttpError(404, 'Not found payment'));
        }
        next(createHttpSuccess(200, { payment: foundPayment }));
    } catch (error) {
        next(error);
    }
};

export const getListPayment = async (req: Request, res: Response, next: NextFunction) => {
    const { limit, page, status, methodPayment } = req.query;
    try {
        const { amount, offset } = paginationHelper(limit as string, page as string);
        const query = PaymentQuery.find()
            .select({ createdAt: false, updatedAt: false, __v: false })
            .sort({ createdAt: 'descending' });

        if (status) {
            const parseStatus = JSON.parse(status as string);
            query.and([{ status: { $in: parseStatus } }]);
        }

        if (methodPayment) {
            const parseMethodPayment = JSON.parse(methodPayment as string);
            query.and([{ methodPayment: { $in: parseMethodPayment } }]);
        }

        const totalPayment = await query.clone().countDocuments();
        const listPayment = await query.limit(amount).skip(offset).exec();
        next(createHttpSuccess(200, { listPayment, totalPayment }));
    } catch (error) {
        next(error);
    }
};
