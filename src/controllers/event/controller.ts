import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { EventQuery } from '../../models';
import { createHttpSuccess, paginationHelper, searchHelper } from '../../utils';
import { FirebaseParty } from '../../third-party';
import { UploadType } from '../../constants';

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        contractId,
        serviceIds,
        employeeIds,
        timelineIds,
        equipmentIds,
        dateTime,
        status,
        note,
        attachments,
    } = req.body;

    if (!name) {
        return next(createHttpError(400, 'Event name must be not empty'));
    }

    try {
        const createdEvent = await EventQuery.create({
            name,
            contract: contractId,
            services: serviceIds,
            employees: employeeIds,
            timelines: timelineIds,
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
        contractId,
        serviceIds,
        employeeIds,
        timelineIds,
        equipmentIds,
        dateTime,
        status,
        note,
        attachments,
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
                contract: contractId,
                services: serviceIds,
                employees: employeeIds,
                timelines: timelineIds,
                equipments: equipmentIds,
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
            .populate('contract', { createdAt: false, updatedAt: false, __v: false })
            .populate('services', { createdAt: false, updatedAt: false, __v: false })
            .populate('employees', { createdAt: false, updatedAt: false, __v: false })
            .populate('timelines', { createdAt: false, updatedAt: false, __v: false })
            .populate('equipments', { createdAt: false, updatedAt: false, __v: false });
        return next(createHttpSuccess(200, { event: foundEvent }));
    } catch (error) {
        return next(error);
    }
};

export const getListEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { limit, page, search } = req.query;
    const { amount, offset } = paginationHelper(limit as string, page as string);
    try {
        const query = EventQuery.find()
            .select({ createdAt: false, updatedAt: false, __v: false })
            .populate('contract', { createdAt: false, updatedAt: false, __v: false })
            .populate('services', { createdAt: false, updatedAt: false, __v: false })
            .populate('employees', { createdAt: false, updatedAt: false, __v: false })
            .populate('timelines', { createdAt: false, updatedAt: false, __v: false })
            .populate('equipments', { createdAt: false, updatedAt: false, __v: false });

        if (search) {
            query.and([{ name: searchHelper(search as string) }]);
        }

        const totalEvent = await query.clone().countDocuments();
        const listEvent = await query.limit(amount).skip(offset).exec();

        return next(createHttpSuccess(200, { listEvent, totalEvent }));
    } catch (error) {
        return next(error);
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
            return await FirebaseParty.uploadImage(image, UploadType.Event);
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
        const imageUrl = await FirebaseParty.uploadImage(image as Express.Multer.File, UploadType.Event);
        await EventQuery.updateOne({ _id }, { $push: { images: imageUrl } });
        return next(createHttpSuccess(200, {}));
    } catch (error) {
        return next(error);
    }
};
