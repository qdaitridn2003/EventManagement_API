import { Request, Response, NextFunction } from 'express';
import { TransportQuery, EmployeeQuery, EventQuery, RoleQuery, TimelineQuery } from '../../models';
import { createHttpSuccess, paginationHelper, searchHelper, timestampHelper } from '../../utils';
import { AuthSchemaType } from '../../types';
import createHttpError from 'http-errors';
import { FirebaseParty } from '../../third-party';
import { UploadType } from '../../constants';

export const createTransport = async (req: Request, res: Response, next: NextFunction) => {
    const { employee: employeeId, event: eventId, licensePlate, status, name, brand, color, availability } = req.body;
    try {
        const employeeResult = await EmployeeQuery.findOne({ _id: employeeId })
            .populate({
                path: 'auth',
                select: { _id: true, role: true },
                populate: {
                    path: 'role',
                    select: { _id: true, name: true },
                },
            })
            .select({ createdAt: false, updatedAt: false, __v: false });
        if (!employeeResult || !employeeResult.auth) {
            return next(createHttpError(400, 'Employee has no auth information'));
        }

        const authEmployee = employeeResult.auth as AuthSchemaType;
        if (!authEmployee || typeof authEmployee !== 'object' || !('role' in authEmployee)) {
            return next(createHttpError(400, 'Invalid auth information in employee '));
        }

        const roleId = authEmployee.role;

        if (!roleId) {
            return next(createHttpError(400, 'Role has no auth information'));
        }

        const roleResult = await RoleQuery.findOne({ _id: roleId });

        if (!roleResult || roleResult.name !== 'Tài Xế') {
            return next(createHttpError(400, 'Employee is not a driver'));
        }
        const createTransport = await TransportQuery.create({
            employee: employeeResult._id,
            licensePlate,
            status,
            name,
            brand,
            color,
            availability,
        });

        return next(createHttpSuccess(200, { transport: createTransport }));
    } catch (error) {
        return next(error);
    }
};
export const updateTransport = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { employee: employeeId, event: eventId, licensePlate, status, name, brand, color, availability } = req.body;

    try {
        const foundTransport = await TransportQuery.findOne({ _id });
        if (!foundTransport) {
            return next(createHttpError(404, 'Not found transport'));
        }
        const employeeResult = await EmployeeQuery.findOne({ _id: employeeId })
            .populate({
                path: 'auth',
                select: { _id: true, role: true },
                populate: {
                    path: 'role',
                    select: { _id: true, name: true },
                },
            })
            .select({ createdAt: false, updatedAt: false, __v: false });
        if (!employeeResult) {
            throw createHttpError(400, 'Invalid employee ID');
        }
        const authEmployee = employeeResult.auth as AuthSchemaType;
        if (!authEmployee || typeof authEmployee !== 'object' || !('role' in authEmployee)) {
            throw createHttpError(400, 'Invalid auth information in employee');
        }
        const roleId = authEmployee.role;

        if (!roleId) {
            throw createHttpError(400, 'Role has no auth information');
        }

        const roleResult = await RoleQuery.findOne({ _id: roleId });

        if (!roleResult || roleResult.name !== 'Tài Xế') {
            throw createHttpError(400, 'Employee is not a driver');
        }

        await TransportQuery.updateOne(
            { _id: foundTransport._id },
            {
                employee: employeeResult._id,
                licensePlate,
                status,
                name,
                brand,
                color,
                availability,
            },
        );
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};
export const deleteTransport = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundTransport = await TransportQuery.findOne({ _id });
        if (!foundTransport) {
            return next(createHttpError(404, 'Not found transport'));
        }
        await TransportQuery.deleteOne({ _id: foundTransport._id });
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};
export const getListTransport = async (req: Request, res: Response, next: NextFunction) => {
    const { search, limit, page, color, brand, licensePlate } = req.query;
    try {
        const { amount, offset } = paginationHelper(limit as string, page as string);
        const query = TransportQuery.find().select({ createdAt: false, updatedAt: false, __v: false });
        if (search) {
            query.and([{ name: { $regex: searchHelper(search as string) } }]);
        }
        if (color) {
            query.and([{ color: { $regex: searchHelper(color as string) } }]);
        }
        if (brand) {
            query.and([{ brand: { $regex: searchHelper(brand as string) } }]);
        }
        if (licensePlate) {
            query.and([{ licensePlate: { $regex: searchHelper(licensePlate as string) } }]);
        }
        const totalTimeline = await query.clone().countDocuments();
        const listTimeline = await query.limit(amount).skip(offset).exec();
        return next(createHttpSuccess(200, { listTimeline, totalTimeline }));
    } catch (error) {}
};
export const getTransportDetail = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const transport = await TransportQuery.findById(_id).select({ createdAt: false, updatedAt: false, __v: false });
        if (!transport) {
            return next(createHttpError(400, 'Transport not found'));
        }
        return next(createHttpSuccess(200, { transport }));
    } catch (error) {
        return next(error);
    }
};
export const uploadImageTransport = async (req: Request, res: Response, next: NextFunction) => {
    const image = req.file;
    const { _id } = req.params;
    try {
        const foundTransport = await TransportQuery.findOne({ _id });
        if (!foundTransport) {
            return next(createHttpError(404, 'Not found transport'));
        }
        const imageUrl = await FirebaseParty.uploadImage(image as Express.Multer.File, UploadType.Transport);
        await TransportQuery.updateOne({ _id: foundTransport._id }, { image: imageUrl });
        return next(createHttpSuccess(200, {}));
    } catch (error) {
        return next(error);
    }
};
