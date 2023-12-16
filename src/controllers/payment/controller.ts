import { Request, Response, NextFunction } from 'express';
import { EventQuery, PaymentQuery } from '../../models';
import createHttpError from 'http-errors';
import { createHttpSuccess, discountPaymentHelper, paginationHelper } from '../../utils';

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
    const { totalPayment, initialPayment, discount, status, methodPayment, note } = req.body;

    if (!totalPayment) {
        return next(createHttpError(400, 'Total payment must be not empty or equal to zero'));
    }

    try {
        const handledTotalPayment = discountPaymentHelper(totalPayment, discount);
        const remainingPayment = handledTotalPayment - (initialPayment ?? 0);
        const createdPayment = await PaymentQuery.create({
            totalPayment,
            initialPayment,
            remainingPayment,
            discount,
            status,
            methodPayment,
            note,
        });
        return next(createHttpSuccess(200, { payment: createdPayment }));
    } catch (error) {
        next(error);
    }
};

export const updatePayment = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { totalPayment, initialPayment, status, discount, methodPayment, note } = req.body;

    try {
        const foundPayment = await PaymentQuery.findById(_id);
        if (!foundPayment) {
            return next(createHttpError(404, 'Not found payment'));
        }

        const handledTotalPayment = discountPaymentHelper(
            totalPayment ?? foundPayment.totalPayment,
            discount ?? foundPayment.discount,
        );
        const remainingPayment = handledTotalPayment - initialPayment;

        await PaymentQuery.updateOne(
            { _id: foundPayment._id },
            {
                totalPayment,
                initialPayment,
                remainingPayment,
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
        await EventQuery.updateOne({ payment: foundPayment._id }, { payment: null });
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
