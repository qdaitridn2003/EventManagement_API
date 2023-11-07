import { Request, Response, NextFunction } from 'express';
import { OtherValidator, createHttpSuccess } from '../../utils';
import { EmployeeQuery } from '../../models';
import { FirebaseParty } from '../../third-party';
import { UploadType } from '../../constants';

export const registerEmployeeProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { authId, email, fullName, dateOfBirth, gender, phoneNumber, address } = req.body;
    const validator = OtherValidator.registerInfoValidator.safeParse({ email, gender, phoneNumber });

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
        const avatarUrl = await FirebaseParty.uploadImage(avatar as Express.Multer.File, UploadType.Avatar);
        await EmployeeQuery.updateOne({ _id }, { avatar: avatarUrl });
        return next(createHttpSuccess(200, {}));
    } catch (error) {
        next(error);
    }
};
