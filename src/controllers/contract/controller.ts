import { Request, Response, NextFunction } from 'express';
import { ClientQuery, ContractQuery, EmployeeQuery, PaymentQuery } from '../../models';
import createHttpError from 'http-errors';
import { createHttpSuccess, discountHandleHelper, paginationHelper, searchHelper, timestampHelper } from '../../utils';
import { ContractStatus } from '../../constants';

export const createContract = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        startDate,
        endDate,
        status,
        contractNote,
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
        const discountAmount = parseFloat(totalPayment as string) * discountHandleHelper(discount);
        const remainingPayment = parseFloat(totalPayment) - parseFloat(initialPayment) - discountAmount;
        console.log(discountHandleHelper(discount));
        const createdPayment = await PaymentQuery.create({
            initialPayment,
            remainingPayment,
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
            note: contractNote,
            attachments: attachments && JSON.parse(attachments as string),
        });
        await EmployeeQuery.updateOne({ _id: employeeId }, { contract: createdContract._id });
        await ClientQuery.updateOne({ _id: clientId }, { $push: { contracts: createdContract._id } });
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
            {
                name,
                startDate,
                endDate,
                status,
                note,
                attachments: attachments ? JSON.parse(attachments as string) : foundContract.attachments,
            },
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
        await EmployeeQuery.updateMany({ contract: foundContract._id }, { contract: null });
        await ClientQuery.updateMany({ contracts: foundContract }, { $pull: { contracts: foundContract._id } });
        await ContractQuery.deleteOne({ _id });
        await PaymentQuery.deleteOne({ _id: foundContract.payment });
        next(createHttpSuccess(200, {}));
    } catch (error) {
        next(error);
    }
};

export const getDetailContract = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundContract = await ContractQuery.findOne({ _id })
            .populate('payment', { createdAt: false, updatedAt: false, __v: false })
            .select({
                createdAt: false,
                updatedAt: false,
                __v: false,
            });
        if (!foundContract) {
            return next(createHttpError(404, 'Not found contract'));
        }
        const foundEmployee = await EmployeeQuery.findOne({ contract: foundContract._id }).select({
            _id: true,
            fullName: true,
            avatar: true,
        });
        const foundClient = await ClientQuery.findOne({ contracts: foundContract }).select({
            _id: true,
            fullName: true,
            avatar: true,
        });
        next(
            createHttpSuccess(200, {
                contract: foundContract,
                employee: foundEmployee,
                client: foundClient,
            }),
        );
    } catch (error) {
        next(error);
    }
};

export const getListContract = async (req: Request, res: Response, next: NextFunction) => {
    const { search, limit, page, startDate, endDate, status } = req.query;

    try {
        const query = ContractQuery.find()
            .populate('payment', { createdAt: false, updatedAt: false, __v: false })
            .select({ createdAt: false, updatedAt: false, __v: false });
        if (search) {
            query.and([{ name: { $regex: searchHelper(search as string) } }]);
        }

        if (status) {
            const parsedStatus = JSON.parse(status as string);
            query.and([{ status: { $in: parsedStatus } }]);
        }

        if (startDate && endDate) {
            const startTimestamp = timestampHelper(new Date(startDate as string));
            const endTimestamp = timestampHelper(new Date(endDate as string));
            const nowTimestamp = timestampHelper(new Date());
            if (startDate !== endDate) {
                query.and([
                    { startDate: { $gte: startTimestamp.dateStart } },
                    { endDate: { $lt: endTimestamp.dateEnd } },
                ]);
            } else if (startDate === endDate) {
                query.and([
                    { startDate: { $gte: startTimestamp.dateStart } },
                    { endDate: { $lt: nowTimestamp.dateEnd } },
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
