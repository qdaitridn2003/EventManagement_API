import { Request, Response, NextFunction } from 'express';
import { EmployeeValidator, createHttpSuccess } from '../../utils';
import { EmployeeQuery } from '../../models';
import { FirebaseParty } from '../../third-party';

export const registerEmployeeProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { authId, email, fullName, dateOfBirth, gender, phoneNumber, address } = req.body;
    const validator = EmployeeValidator.registerEmployeeValidator.safeParse({ email, gender, phoneNumber });

    if (!validator.success) {
        return next(validator.error);
    }

    try {
        const result = await EmployeeQuery.create({
            auth: authId,
            email,
            fullName,
            phoneNumber,
            address,
            dateOfBirth: new Date(dateOfBirth),
        });
        if (result) {
            return next(createHttpSuccess(200, { employee: result }));
        }
    } catch (error) {
        return next(error);
    }
};

export const uploadEmployeeAvatar = async (req: Request, res: Response, next: NextFunction) => {
    const avatar = req.file;
    const { _id } = req.params;
    try {
        const avatarUrl = await FirebaseParty.uploadAvatarImage(avatar as Express.Multer.File);
        await EmployeeQuery.updateOne({ _id }, { avatar: avatarUrl });
        return next(createHttpSuccess(200, {}));
    } catch (error) {
        next(error);
    }
};
