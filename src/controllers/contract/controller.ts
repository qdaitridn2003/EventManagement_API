import { Request, Response, NextFunction } from 'express';
import { ClientQuery, ContractQuery, EventQuery, PaymentQuery } from '../../models';
import createHttpError from 'http-errors';
import { createHttpSuccess, paginationHelper, paymentHelper, searchHelper, timestampHelper } from '../../utils';
import { EventSchemaType, PaymentSchemaType } from '../../types';

export const createContract = async (req: Request, res: Response, next: NextFunction) => {
    const { name, startDate, endDate, status, note, attachments, clientId, eventIds } = req.body;
    const { employee_id } = res.locals;

    if (!name) {
        return next(createHttpError(400, 'Contract name must be not empty'));
    }

    if (!clientId) {
        return next(createHttpError(400, 'Client must be have'));
    }

    try {
        const createdContract = await ContractQuery.create({
            name,
            startDate,
            endDate,
            status,
            note,
            events: eventIds,
            createdBy: employee_id,
            attachments: attachments && JSON.parse(attachments as string),
        });
        await ClientQuery.updateOne({ _id: clientId }, { $push: { contracts: createdContract._id } });
        return next(createHttpSuccess(200, { contract: createdContract }));
    } catch (error) {
        next(error);
    }
};

export const updateContract = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { name, startDate, endDate, status, note, attachments, eventIds } = req.body;
    const { employee_id } = res.locals;

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
                events: eventIds,
                updatedBy: employee_id,
                attachments: attachments ? JSON.parse(attachments as string) : foundContract.attachments,
            },
        );
        return next(createHttpSuccess(200, {}));
    } catch (error) {
        next(error);
    }
};

export const deleteContract = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundContract = await ContractQuery.findOne({ _id }).populate({
            path: 'event',
            select: { createdAt: false, updatedAt: false, __v: false },
            populate: { path: 'payment' },
        });

        if (!foundContract) {
            return next(createHttpError(404, 'Not found contract'));
        }

        const paymentIds = (foundContract.events as EventSchemaType[]).map(
            (event) => (event.payment as PaymentSchemaType)._id,
        );

        await EventQuery.deleteMany({ _id: { $in: foundContract.events } });
        await PaymentQuery.deleteMany({ _id: { $in: paymentIds } });
        await ClientQuery.updateMany({ contracts: foundContract }, { $pull: { contracts: foundContract._id } });
        await ContractQuery.deleteOne({ _id });
        return next(createHttpSuccess(200, {}));
    } catch (error) {
        next(error);
    }
};

export const getDetailContract = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundContract = await ContractQuery.findOne({ _id })
            .populate({
                path: 'events',
                select: { createdAt: false, updatedAt: false, __v: false },
                populate: { path: 'payment' },
            })
            .select({
                createdAt: false,
                updatedAt: false,
                __v: false,
            });

        if (!foundContract) {
            return next(createHttpError(404, 'Not found contract'));
        }

        const foundClient = await ClientQuery.findOne({ contracts: foundContract }).select({
            _id: true,
            fullName: true,
            avatar: true,
        });

        const totalPayment = paymentHelper('total', foundContract);
        const initialPayment = paymentHelper('initial', foundContract);
        const remainingPayment = paymentHelper('remaining', foundContract);

        return next(
            createHttpSuccess(200, {
                client: foundClient,
                contract: foundContract,
                totalPayment,
                initialPayment,
                remainingPayment,
            }),
        );
    } catch (error) {
        return next(error);
    }
};

export const getListContract = async (req: Request, res: Response, next: NextFunction) => {
    const { search, limit, page, startDate, endDate, status } = req.query;

    try {
        const query = ContractQuery.find()
            .populate('employee', { createdAt: false, updatedAt: false, __v: false })
            .select({ createdAt: false, updatedAt: false, __v: false })
            .sort({ createdAt: 'descending' });

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
        return next(createHttpSuccess(200, { listContract, totalContract }));
    } catch (error) {
        next(error);
    }
};
