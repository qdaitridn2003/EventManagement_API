import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { ContractQuery, EventQuery, PaymentQuery, TransportQuery } from '../../models';
import { createHttpSuccess, paginationHelper, searchHelper } from '../../utils';
import { FirebaseParty } from '../../third-party';
import { Identify, UploadType } from '../../constants';
import sharp from 'sharp';

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { name, dateTime, status, note, attachments } = req.body;
    const { paymentId, transportIds, serviceId, employeeIds, timelineIds, equipmentIds } = req.body;

    if (!name) {
        return next(createHttpError(400, 'Event name must be not empty'));
    }

    try {
        const createdEvent = await EventQuery.create({
            name,
            payment: paymentId,
            service: serviceId,
            employees: employeeIds,
            timelines: timelineIds,
            transports: transportIds,
            equipments: equipmentIds,
            dateTime: new Date(dateTime),
            status,
            note,
            attachments,
        });
        return next(createHttpSuccess(200, { event: createdEvent }));
    } catch (error) {
        return next(error);
    }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const {
        name,
        paymentId,
        serviceId,
        employeeIds,
        timelineIds,
        equipmentIds,
        dateTime,
        status,
        note,
        attachments,
        transportIds,
    } = req.body;
    try {
        const foundEvent = await EventQuery.findOne({ _id });
        if (!foundEvent) {
            return next(createHttpError(404, 'Not found event'));
        }
        await EventQuery.updateOne(
            { _id: foundEvent._id },
            {
                name,
                payment: paymentId,
                service: serviceId,
                employees: employeeIds,
                timelines: timelineIds,
                equipments: equipmentIds,
                transports: transportIds,
                dateTime: new Date(dateTime),
                status,
                note,
                attachments,
            },
        );
        return next(createHttpSuccess(200, {}));
    } catch (error) {
        return next(error);
    }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundEvent = await EventQuery.findOne({ _id });
        if (!foundEvent) {
            return next(createHttpError(404, 'Not found event'));
        }
        await EventQuery.deleteOne({ _id: foundEvent._id });
        await PaymentQuery.deleteOne({ _id: foundEvent.payment });
        await ContractQuery.updateMany({ events: foundEvent }, { $pull: { events: foundEvent._id } });
        await TransportQuery.updateMany({ event: foundEvent._id }, { event: null });
        return next(createHttpSuccess(200, {}));
    } catch (error) {
        return next(error);
    }
};

export const getDetailEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundEvent = await EventQuery.findOne({ _id })
            .select({ createdAt: false, updatedAt: false, __v: false })
            .populate('payment', { createdAt: false, updatedAt: false, __v: false })
            .populate({
                path: 'transports',
                select: { createdAt: false, updatedAt: false, __v: false },
                populate: { path: 'employee' },
            })
            .populate('service', { createdAt: false, updatedAt: false, __v: false })
            .populate('employees', { createdAt: false, updatedAt: false, __v: false })
            .populate('timelines', { createdAt: false, updatedAt: false, __v: false })
            .populate('equipments', { createdAt: false, updatedAt: false, __v: false });
        const foundContract = await ContractQuery.find({ events: foundEvent }).select({ _id: true, name: true });
        return next(createHttpSuccess(200, { event: foundEvent, contract: foundContract }));
    } catch (error) {
        return next(error);
    }
};

export const getListEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { limit, page, search } = req.query;
    const { amount, offset } = paginationHelper(limit as string, page as string);
    const { identify, employee_id } = res.locals;
    try {
        const query = EventQuery.find()
            .select({ createdAt: false, updatedAt: false, __v: false })
            .sort({ createdAt: 'descending' })
            .populate('payment', { createdAt: false, updatedAt: false, __v: false })
            .populate('service', { createdAt: false, updatedAt: false, __v: false })
            .populate('employees', { createdAt: false, updatedAt: false, __v: false })
            .populate('timelines', { createdAt: false, updatedAt: false, __v: false })
            .populate('equipments', { createdAt: false, updatedAt: false, __v: false })
            .populate('transports', { createdAt: false, updatedAt: false, __v: false });

        if (search) {
            query.and([{ name: searchHelper(search as string) }]);
        }

        if (identify !== Identify.Admin) {
            query.and([{ employees: { $in: [employee_id] } }]);
        }

        const totalEvent = await query.clone().countDocuments();
        const listEvent = await query.limit(amount).skip(offset).exec();

        return next(createHttpSuccess(200, { listEvent, totalEvent }));
    } catch (error) {
        next(error);
    }
};

export const uploadImagesEvent = async (req: Request, res: Response, next: NextFunction) => {
    const images = req.files;
    const { _id } = req.params;
    try {
        const foundEvent = await EventQuery.findOne({ _id });
        if (!foundEvent) {
            return next(createHttpError(404, 'Not found event'));
        }
        const imageUrls = (images as Express.Multer.File[]).map(async (image: Express.Multer.File) => {
            const imageBuffer = await sharp(image.buffer).resize(720, 480, { fit: 'fill' }).toBuffer();
            return await FirebaseParty.uploadImage({ ...image, buffer: imageBuffer }, UploadType.Event);
        });
        await EventQuery.updateOne({ _id }, { images: imageUrls });
        return next(createHttpSuccess(200, {}));
    } catch (error) {
        return next(error);
    }
};

export const uploadImageEvent = async (req: Request, res: Response, next: NextFunction) => {
    const image = req.file;
    const { _id } = req.params;
    try {
        const foundEvent = await EventQuery.findOne({ _id });
        if (!foundEvent) {
            return next(createHttpError(404, 'Not found event'));
        }
        const imageBuffer = await sharp(image?.buffer)
            .resize(720, 480, { fit: 'fill' })
            .toBuffer();
        const imageUrl = await FirebaseParty.uploadImage(
            { ...(image as Express.Multer.File), buffer: imageBuffer },
            UploadType.Event,
        );
        await EventQuery.updateOne({ _id }, { $push: { images: imageUrl } });
        return next(createHttpSuccess(200, {}));
    } catch (error) {
        return next(error);
    }
};
