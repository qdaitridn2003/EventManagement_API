import { Request, Response, NextFunction } from 'express';
import { OtherValidator, createHttpSuccess, paginationHelper, searchHelper } from '../../utils';
import { AuthQuery, ContractQuery, EmployeeQuery, EventQuery, RoleQuery, TransportQuery } from '../../models';
import { FirebaseParty } from '../../third-party';
import { Identify, UploadType } from '../../constants';
import createHttpError from 'http-errors';
import { RoleSchemaType } from '../../types';
import sharp from 'sharp';

export const registerEmployeeProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { authId, fullName, dateOfBirth, gender, phoneNumber, address } = req.body;
    const validator = OtherValidator.registerInfoValidator.safeParse({ gender, phoneNumber });

    if (!validator.success) {
        return next(validator.error);
    }

    try {
        const foundAccount = await AuthQuery.findOne({ _id: authId });
        if (!foundAccount) {
            return next(createHttpError(404, 'Not found account'));
        }

        const createdEmployee = await EmployeeQuery.create({
            auth: authId,
            email: foundAccount.username,
            fullName,
            phoneNumber,
            gender,
            address,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
        });
        return next(createHttpSuccess(200, { employee: createdEmployee }));
    } catch (error) {
        return next(error);
    }
};

export const updateEmployeeProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { employee_id } = res.locals;
    const { email, fullName, dateOfBirth, gender, phoneNumber, address } = req.body;
    const validator = OtherValidator.registerInfoValidator.safeParse({ email, gender, phoneNumber });

    if (!validator.success) {
        return next(validator.error);
    }
    try {
        const foundEmployee = await EmployeeQuery.findOne({ _id: employee_id });
        if (!foundEmployee) {
            return next(createHttpError(404, 'Not found employee'));
        }

        await EmployeeQuery.updateOne(
            { _id: foundEmployee._id },
            {
                email,
                fullName,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(foundEmployee.dateOfBirth),
                gender,
                phoneNumber,
                address,
            },
        );
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};

export const getEmployeeProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { employee_id } = res.locals;
    const { _id } = req.params;
    try {
        const foundEmployee = await EmployeeQuery.findOne({ _id: _id ? _id : employee_id })
            .populate({
                path: 'auth',
                select: { _id: true, username: true, role: true },
                match: { verifiedAt: { $nin: [null] }, isVerified: { $eq: true } },
                populate: {
                    path: 'role',
                    select: { _id: true, name: true },
                },
            })
            .select({ createdAt: false, updatedAt: false, __v: false });
        if (!foundEmployee) {
            return next(createHttpError(404, 'Not found employee'));
        }
        return next(createHttpSuccess(200, { employee: foundEmployee }));
    } catch (error) {
        return next(error);
    }
};

export const getEmployeeList = async (req: Request, res: Response, next: NextFunction) => {
    const { search, role, limit, page } = req.query;
    try {
        const { amount, offset } = paginationHelper(limit as string, page as string);
        const query = EmployeeQuery.find()
            .populate({
                path: 'auth',
                select: { _id: true, username: true, role: true },
                match: { verifiedAt: { $nin: [null] }, isVerified: { $eq: true } },
                populate: {
                    path: 'role',
                    select: { _id: true, name: true },
                },
            })
            .select({ createdAt: false, updatedAt: false, __v: false })
            .sort({ createdAt: 'descending' });

        if (search) {
            query.and([{ fullName: { $regex: searchHelper(search as string) } }]);
        }

        if (role) {
            const parseRole = JSON.parse(role as string);
            const listRole = await RoleQuery.find({ name: { $in: parseRole } }).select({ _id: true });
            const listAuth = await AuthQuery.find({ role: { $in: listRole } }).select({ _id: true });
            query.and([{ auth: { $in: listAuth } }]);
        }

        const totalEmployee = await query.clone().countDocuments();
        const listEmployee = await query.limit(amount).skip(offset).exec();

        return next(createHttpSuccess(200, { listEmployee, totalEmployee }));
    } catch (error) {
        return next(error);
    }
};

export const uploadEmployeeAvatar = async (req: Request, res: Response, next: NextFunction) => {
    const avatar = req.file;
    const { employee_id } = res.locals;
    try {
        const foundEmployee = await EmployeeQuery.findOne({ _id: employee_id });
        if (!foundEmployee) {
            return next(createHttpError(404, 'Not found employee'));
        }
        const avatarBuffer = await sharp(avatar?.buffer)
            .resize(480, 480)
            .toBuffer();
        const avatarUrl = await FirebaseParty.uploadImage(
            { ...(avatar as Express.Multer.File), buffer: avatarBuffer },
            UploadType.Avatar,
        );
        await EmployeeQuery.updateOne({ _id: foundEmployee._id }, { avatar: avatarUrl });
        return next(createHttpSuccess(200, {}));
    } catch (error) {
        next(error);
    }
};

export const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundEmployee = await EmployeeQuery.findOne({ _id });
        if (!foundEmployee) {
            return next(createHttpError(404, 'Not found employee'));
        }

        const foundEmployeeAccount = await AuthQuery.findOne({ _id: foundEmployee.auth }).populate('role');
        if ((foundEmployeeAccount?.role as RoleSchemaType).identify === Identify.Admin) {
            return next(createHttpError(403, 'You cannot delete admin profile'));
        }

        await EmployeeQuery.deleteOne({ _id: foundEmployee._id });
        await EventQuery.updateMany({ employees: foundEmployee }, { $pull: { employees: foundEmployee._id } });
        await ContractQuery.updateMany({ createdBy: foundEmployee._id }, { createdBy: null });
        await ContractQuery.updateMany({ updatedBy: foundEmployee._id }, { updatedBy: null });
        await TransportQuery.updateMany({ employee: foundEmployee._id }, { employee: null });
        await AuthQuery.deleteOne({ _id: foundEmployee?.auth });
        next(createHttpSuccess(200, {}));
    } catch (error) {
        next(error);
    }
};

export const editEmployeeRole = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { roleId } = req.body;
    try {
        const foundEmployee = await EmployeeQuery.findOne({ _id });
        if (!foundEmployee) {
            return next(createHttpError(404, 'Not found employee'));
        }
        await AuthQuery.updateOne({ _id: foundEmployee.auth }, { role: roleId });
        next(createHttpSuccess(200, {}));
    } catch (error) {
        next(error);
    }
};
