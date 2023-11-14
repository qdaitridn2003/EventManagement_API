import { Request, Response, NextFunction } from 'express';
import {
    AuthValidator,
    HashPasswordHandler,
    TokenHandler,
    OtpHandler,
    createHttpSuccess,
    verifyOTPHelper,
} from '../../utils';
import { AuthQuery, EmployeeQuery, RoleQuery } from '../../models';
import createHttpError from 'http-errors';
import { NodeMailerParty } from '../../third-party';
import { RoleSchemaType } from '../../types';
import { OtpType } from '../../constants';

export const signUpAccount = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, confirmPassword, roleId } = req.body;
    const validate = AuthValidator.registerAccountValidator.safeParse({
        username,
        password,
        confirmPassword,
    });

    if (!validate.success) {
        return next(validate.error);
    }

    try {
        const existingEmailAccount = await AuthQuery.findOne({ username });

        if (existingEmailAccount) {
            return next(createHttpError(400, 'Email is already exist'));
        }

        const foundRole = await RoleQuery.findOne({ _id: roleId });
        if (!foundRole) {
            return next(createHttpError(400, 'Role is not exist'));
        }
        const hashPassword = HashPasswordHandler.hashPassword(password);
        const result = await AuthQuery.create({
            username,
            password: hashPassword,
            role: foundRole._id,
        });

        const otpSecret = await TokenHandler.signToken(
            { auth_id: result._id, type: OtpType.ConfirmEmail },
            'otp_secret',
        );
        const otp = OtpHandler.generateOtp(otpSecret);
        NodeMailerParty.mailingVerifyAccount(username, otp);

        next(createHttpSuccess(200, { username: result.username, otpSecret }));
    } catch (error) {
        next(error);
    }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    const { otp, otpSecret } = req.body;

    try {
        const { check, type, auth_id } = verifyOTPHelper(otp, otpSecret);

        if (!check) {
            return next(createHttpError(401, 'Otp was expired or invalid'));
        }

        if (type === OtpType.ConfirmEmail) {
            await AuthQuery.updateOne({ _id: auth_id }, { isVerified: true, verifiedAt: new Date() });
            return next(createHttpSuccess(200, null, 'Verify account successfully'));
        } else if (type === OtpType.ResetPassword) {
            const foundAccount = await AuthQuery.findOne({ _id: auth_id });
            return next(createHttpSuccess(200, { username: foundAccount?.username }, 'Verify otp successfully'));
        }
    } catch (error) {
        return next(error);
    }
};

export const resendOtpForConfirmEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;

        const foundAccount = await AuthQuery.findOne({ username });
        if (!foundAccount) {
            return next(createHttpError(400, 'Account is not exist'));
        }

        const otpSecret = await TokenHandler.signToken(
            {
                auth_id: foundAccount._id,
                type: OtpType.ConfirmEmail,
            },
            'otp_secret',
        );
        const otp = OtpHandler.generateOtp(otpSecret);
        NodeMailerParty.mailingVerifyAccount(username, otp);

        return next(createHttpSuccess(200, { otpSecret: otpSecret }));
    } catch (error) {
        next(error);
    }
};

export const resendOtpForConfirmResetPass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;

        const foundAccount = await AuthQuery.findOne({ username });
        if (!foundAccount) {
            return next(createHttpError(400, 'Account is not exist'));
        }

        const otpSecret = await TokenHandler.signToken(
            {
                auth_id: foundAccount._id,
                type: OtpType.ResetPassword,
            },
            'otp_secret',
        );
        const otp = OtpHandler.generateOtp(otpSecret);
        NodeMailerParty.mailingResetPassword(username, otp);

        return next(createHttpSuccess(200, { otpSecret: otpSecret }));
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;

        const foundAccount = await AuthQuery.findOne({ username });
        if (!foundAccount) {
            return next(createHttpError(400, 'Account is not exist'));
        }

        const otpSecret = await TokenHandler.signToken(
            {
                auth_id: foundAccount._id,
                type: OtpType.ResetPassword,
            },
            'otp_secret',
        );
        const otp = OtpHandler.generateOtp(otpSecret);
        NodeMailerParty.mailingResetPassword(username, otp);

        return next(createHttpSuccess(200, { otpSecret: otpSecret }));
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, confirmPassword } = req.body;
        const validate = AuthValidator.passwordValidator.safeParse({
            password,
            confirmPassword,
        });

        if (!validate.success) {
            return next(validate.error);
        }

        const hashPassword = HashPasswordHandler.hashPassword(password);
        await AuthQuery.updateOne({ username }, { password: hashPassword });
        next(createHttpSuccess(200, null));
    } catch (error) {
        next(error);
    }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    try {
        const result = await AuthQuery.findOne({ username }).populate('role');

        if (!result) return next(createHttpError(400, 'Account is not exist'));

        const comparedResult = HashPasswordHandler.comparePassword(password, result.password);

        if (!comparedResult) return next(createHttpError(400, 'Password is not correct'));

        if (!result.isVerified && !result.verifiedAt)
            return next(createHttpError(401, 'You need to confirm signed up email address'));

        const foundEmployee = await EmployeeQuery.findOne({ auth: result._id });

        if (!foundEmployee) {
            return next(createHttpError(400, 'Not found employee'));
        }

        const accessToken = await TokenHandler.signToken(
            {
                auth_id: result._id,
                employee_id: foundEmployee._id,
                identify: (result.role as RoleSchemaType).identify,
            },
            'access',
        );

        const refreshToken = await TokenHandler.signToken(
            {
                auth_id: result._id,
                employee_id: foundEmployee._id,
                identify: (result.role as RoleSchemaType).identify,
            },
            'refresh',
        );

        return next(createHttpSuccess(200, { accessToken, refreshToken }));
    } catch (error) {
        return next(error);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { auth_id } = res.locals;

    try {
        const foundAccount = await AuthQuery.findOne({ _id: auth_id });

        if (!foundAccount) {
            return next(createHttpError(400, 'Account is not exist'));
        }

        const validateResult = AuthValidator.changePasswordValidator.safeParse({
            oldPassword,
            newPassword,
            confirmPassword,
        });

        if (!validateResult.success) {
            return next(validateResult.error);
        }

        const comparePassword = HashPasswordHandler.comparePassword(oldPassword, foundAccount.password);

        if (!comparePassword) {
            return next(createHttpError(400, 'Old password is not correct'));
        }

        const hashPassword = HashPasswordHandler.hashPassword(newPassword);

        await AuthQuery.updateOne({ _id: auth_id }, { password: hashPassword });

        next(createHttpSuccess(200));
    } catch (error) {
        next(error);
    }
};
