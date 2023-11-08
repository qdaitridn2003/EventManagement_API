import { Request, Response, NextFunction } from 'express';
import { ClientQuery } from '../../models';
import { OtherValidator, createHttpSuccess, paginationHelper, searchHelper } from '../../utils';
import createHttpError from 'http-errors';
import { FirebaseParty } from '../../third-party';
import { UploadType } from '../../constants';

export const createInfoClient = async (req: Request, res: Response, next: NextFunction) => {
    const { email, fullName, dateOfBirth, gender, phoneNumber, address } = req.body;
    const validator = OtherValidator.registerInfoValidator.safeParse({ email, gender, phoneNumber });

    if (!validator.success) {
        return next(validator.error);
    }

    try {
        await ClientQuery.create({
            email,
            fullName,
            phoneNumber,
            address,
            dataOfBirth: new Date(dateOfBirth),
            gender,
        });
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};

export const updateInfoClient = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { email, fullName, dateOfBirth, gender, phoneNumber, address } = req.body;

    try {
        const foundClient = await ClientQuery.findOne({ _id });
        if (!foundClient) {
            return next(createHttpError(400, 'Not found client'));
        }
        await ClientQuery.updateOne({ _id }, { email, fullName, phoneNumber, address, dateOfBirth, gender });
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};

export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    try {
        const foundClient = await ClientQuery.findOne({ _id });
        if (!foundClient) {
            return next(createHttpError(400, 'Not found client'));
        }
        await ClientQuery.deleteOne({ _id });
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};

export const getClientDetail = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const client = await ClientQuery.findById(_id).select({ createdAt: false, updatedAt: false, __v: false });
        if (!client) {
            return next(createHttpError(400, 'Client not found'));
        }
        return next(createHttpSuccess(200, { client }));
    } catch (error) {
        return next(error);
    }
};

export const getListClient = async (req: Request, res: Response, next: NextFunction) => {
    const { limit, page, search } = req.query;
    try {
        const { amount, offset } = paginationHelper(limit as string, page as string);
        let listClient;
        if (search) {
            listClient = await ClientQuery.find({
                $or: [
                    { fullName: { $regex: searchHelper(search as string) } },
                    { email: { $regex: searchHelper(search as string) } },
                ],
            })
                .select({ createdAt: false, updatedAt: false, __v: false })
                .limit(amount)
                .skip(offset);
        } else {
            listClient = await ClientQuery.find()
                .select({ createdAt: false, updatedAt: false, __v: false })
                .limit(amount)
                .skip(offset);
        }
        const totalClient = await ClientQuery.countDocuments();
        return next(createHttpSuccess(200, { listClient, totalClient }));
    } catch (error) {
        return next(error);
    }
};

export const uploadAvatarClient = async (req: Request, res: Response, next: NextFunction) => {
    const avatar = req.file;
    const { _id } = req.params;
    try {
        const avatarUrl = await FirebaseParty.uploadImage(avatar as Express.Multer.File, UploadType.Avatar);
        await ClientQuery.updateOne({ _id }, { avatar: avatarUrl });
        return next(createHttpSuccess(200, {}));
    } catch (error) {
        next(error);
    }
};