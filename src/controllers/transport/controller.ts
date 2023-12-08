import { Request, Response, NextFunction } from 'express';
import { TransportQuery, EmployeeQuery, RoleQuery, AuthQuery } from '../../models';
import { createHttpSuccess, paginationHelper, searchHelper } from '../../utils';
import createHttpError from 'http-errors';
import { FirebaseParty } from '../../third-party';
import { UploadType } from '../../constants';

export const createTransport = async (req: Request, res: Response, next: NextFunction) => {
    const { employeeId, licensePlate, status, name, brand, color, availability } = req.body;

    if (!employeeId) {
        return next(createHttpError(400, 'Employee must be have'));
    }

    try {
        const roleName = 'Tài Xế';

        const driverRole = await RoleQuery.findOne({ name: roleName });

        if (!driverRole) {
            return next(createHttpError(400, 'Driver role not found'));
        }

        const roleId = driverRole._id;

        const authIds = await AuthQuery.find({ role: roleId }).select({ _id: true });

        const employeeWithDriverRole = await EmployeeQuery.findOne({
            _id: employeeId,
            auth: { $in: authIds },
        }).select({ _id: true });

        if (!employeeWithDriverRole) {
            return next(createHttpError(400, 'Employee is not a driver'));
        }

        const createTransport = await TransportQuery.create({
            employee: employeeId,
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
    const { employeeId, licensePlate, status, name, brand, color, availability } = req.body;

    if (!employeeId) {
        return next(createHttpError(400, 'Employee must be have'));
    }
    try {
        const foundTransport = await TransportQuery.findOne({ _id });

        if (!foundTransport) {
            return next(createHttpError(404, 'Not found transport'));
        }

        const driverRoleName = 'Tài Xế';
        const driverRole = await RoleQuery.findOne({ name: driverRoleName });

        if (!driverRole) {
            return next(createHttpError(400, 'Driver role not found'));
        }

        const roleId = driverRole._id;
        const authIds = await AuthQuery.find({ role: roleId }).select({ _id: true });

        const isEmployeeDriver = await EmployeeQuery.exists({
            _id: employeeId,
            auth: { $in: authIds },
        });

        if (!isEmployeeDriver) {
            return next(createHttpError(400, 'Employee is not a driver'));
        }

        await TransportQuery.updateOne(
            { _id: foundTransport._id },
            {
                employee: employeeId,
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
        const query = TransportQuery.find()
            .select({ createdAt: false, updatedAt: false, __v: false })
            .sort({ createdAt: 'descending' });

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
        const totalTransport = await query.clone().countDocuments();
        const listTransport = await query.limit(amount).skip(offset).exec();
        return next(createHttpSuccess(200, { totalTransport, listTransport }));
    } catch (error) {
        return next(error);
    }
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
