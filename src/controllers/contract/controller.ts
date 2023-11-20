import { Request, Response, NextFunction } from 'express';
import { ClientQuery, ContractQuery, EmployeeQuery, PaymentQuery } from '../../models';
import createHttpError from 'http-errors';
import { createHttpSuccess, paginationHelper, searchHelper, timestampHelper } from '../../utils';
import { ContractStatus } from '../../constants';

export const createContract = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        startDate,
        endDate,
        status,
        note,
        attachments,
        initialPayment,
        totalPayment,
        discount,
        methodPayment,
        paymentNote,
        employeeId,
        clientId,
    } = req.body;

    if (!name) {
        return next(createHttpError(400, 'Contract name must be not empty'));
    }

    if (!employeeId) {
        return next(createHttpError(400, 'Employee must be have'));
    }

    if (!clientId) {
        return next(createHttpError(400, 'Client must be have'));
    }

    try {
        const createdPayment = await PaymentQuery.create({
            initialPayment,
            remainingPayment: parseFloat(totalPayment) - parseFloat(initialPayment),
            totalPayment,
            discount,
            methodPayment,
            note: paymentNote,
        });
        const createdContract = await ContractQuery.create({
            payment: createdPayment._id,
            name,
            startDate,
            endDate,
            status,
            note,
            attachments,
        });
        await EmployeeQuery.updateOne({ _id: employeeId }, { contract: createdContract._id });
        await ClientQuery.updateOne({ _id: clientId }, { contracts: { $push: createdContract._id } });
        next(createHttpSuccess(200, { contract: createdContract }));
    } catch (error) {
        next(error);
    }
};

export const updateContract = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { name, startDate, endDate, status, note, attachments } = req.body;
    try {
        const foundContract = await ContractQuery.findOne({ _id });
        if (!foundContract) {
            return next(createHttpError(404, 'Not found contract'));
        }
        await ContractQuery.updateOne(
            { _id: foundContract._id },
            { name, startDate, endDate, status, note, attachments },
        );
        next(createHttpSuccess(200, {}));
    } catch (error) {
        next(error);
    }
};

export const deleteContract = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundContract = await ContractQuery.findOne({ _id });
        if (!foundContract) {
            return next(createHttpError(404, 'Not found contract'));
        }
        await EmployeeQuery.updateOne({ contract: foundContract._id }, { contract: null });
        await ClientQuery.updateOne({ contract: foundContract._id }, { contracts: { $pull: foundContract } });
        await ContractQuery.deleteOne({ _id });
        next(createHttpSuccess(200, {}));
    } catch (error) {
        next(error);
    }
};

export const getDetailContract = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundContract = await ContractQuery.find({ _id })
            .populate('payment', { createdAt: false, updatedAt: false, __v: false })
            .select({
                createdAt: false,
                updatedAt: false,
                __v: false,
            });
        if (!foundContract) {
            return next(createHttpError(404, 'Not found contract'));
        }
        next(createHttpSuccess(200, { contract: foundContract }));
    } catch (error) {
        next(error);
    }
};

export const getListContract = async (req: Request, res: Response, next: NextFunction) => {
    const { name, limit, page, startDate, endDate, status } = req.query;

    if (
        status !== ContractStatus.Active ||
        status === ContractStatus.Cancelled ||
        status === ContractStatus.Completed
    ) {
        return next(createHttpError(400, 'Invalid contract status'));
    }

    try {
        const query = ContractQuery.find()
            .populate('payment', { createdAt: false, updatedAt: false, __v: false })
            .select({ createdAt: false, updatedAt: false, __v: false });
        if (name) {
            query.and([{ name: { $regex: searchHelper(name as string) } }]);
        }

        if (status) {
            query.and([{ status: { $eq: status } }]);
        }

        if (startDate && endDate) {
            const startTimestamp = timestampHelper(new Date(startDate as string));
            const endTimestamp = timestampHelper(new Date(endDate as string));
            if (startDate !== endDate) {
                query.and([
                    { startDate: { $gte: startTimestamp.dateStart } },
                    { endDate: { $lt: endTimestamp.dateEnd } },
                ]);
            } else if (startDate === endDate) {
                query.and([
                    { startDate: { $gte: startTimestamp.dateStart } },
                    { endDate: { $lt: endTimestamp.dateEnd } },
                ]);
            }
        }
        const { amount, offset } = paginationHelper(limit as string, page as string);
        const totalContract = await query.clone().countDocuments();
        const listContract = await query.limit(amount).skip(offset).exec();
        next(createHttpSuccess(200, { listContract, totalContract }));
    } catch (error) {
        next(error);
    }
};
