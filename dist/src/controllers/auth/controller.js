"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewAccessToken = exports.changePassword = exports.signIn = exports.resetPassword = exports.forgotPassword = exports.resendOtpForConfirmResetPass = exports.resendOtpForConfirmEmail = exports.verifyOtp = exports.signUpAccount = void 0;
const utils_1 = require("../../utils");
const models_1 = require("../../models");
const http_errors_1 = __importDefault(require("http-errors"));
const third_party_1 = require("../../third-party");
const constants_1 = require("../../constants");
const signUpAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, confirmPassword, roleId } = req.body;
    const validate = utils_1.AuthValidator.registerAccountValidator.safeParse({
        username,
        password,
        confirmPassword,
    });
    if (!validate.success) {
        return next(validate.error);
    }
    try {
        const existingEmailAccount = yield models_1.AuthQuery.findOne({ username });
        if (existingEmailAccount) {
            return next((0, http_errors_1.default)(400, 'Email is already exist'));
        }
        const foundRole = yield models_1.RoleQuery.findOne({ _id: roleId });
        if (!foundRole) {
            return next((0, http_errors_1.default)(400, 'Role is not exist'));
        }
        const hashPassword = utils_1.HashPasswordHandler.hashPassword(password);
        const result = yield models_1.AuthQuery.create({
            username,
            password: hashPassword,
            role: foundRole._id,
        });
        const otpSecret = yield utils_1.TokenHandler.signToken({ auth_id: result._id, type: constants_1.OtpType.ConfirmEmail }, 'otp_secret');
        const otp = utils_1.OtpHandler.generateOtp(otpSecret);
        third_party_1.NodeMailerParty.mailingVerifyAccount(username, otp);
        next((0, utils_1.createHttpSuccess)(200, { username: result.username, otpSecret }));
    }
    catch (error) {
        next(error);
    }
});
exports.signUpAccount = signUpAccount;
const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, otpSecret } = req.body;
    try {
        const { check, type, auth_id } = (0, utils_1.verifyOTPHelper)(otp, otpSecret);
        if (!check) {
            return next((0, http_errors_1.default)(401, 'Otp was expired or invalid'));
        }
        if (type === constants_1.OtpType.ConfirmEmail) {
            const foundAccount = yield models_1.AuthQuery.findOneAndUpdate({ _id: auth_id }, { isVerified: true, verifiedAt: new Date() });
            return next((0, utils_1.createHttpSuccess)(200, { auth_id: foundAccount === null || foundAccount === void 0 ? void 0 : foundAccount._id }, 'Verify account successfully'));
        }
        else if (type === constants_1.OtpType.ResetPassword) {
            const foundAccount = yield models_1.AuthQuery.findOne({ _id: auth_id });
            return next((0, utils_1.createHttpSuccess)(200, { username: foundAccount === null || foundAccount === void 0 ? void 0 : foundAccount.username }, 'Verify otp successfully'));
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.verifyOtp = verifyOtp;
const resendOtpForConfirmEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        const foundAccount = yield models_1.AuthQuery.findOne({ username });
        if (!foundAccount) {
            return next((0, http_errors_1.default)(400, 'Account is not exist'));
        }
        const otpSecret = yield utils_1.TokenHandler.signToken({
            auth_id: foundAccount._id,
            type: constants_1.OtpType.ConfirmEmail,
        }, 'otp_secret');
        const otp = utils_1.OtpHandler.generateOtp(otpSecret);
        third_party_1.NodeMailerParty.mailingVerifyAccount(username, otp);
        return next((0, utils_1.createHttpSuccess)(200, { otpSecret: otpSecret }));
    }
    catch (error) {
        next(error);
    }
});
exports.resendOtpForConfirmEmail = resendOtpForConfirmEmail;
const resendOtpForConfirmResetPass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        const foundAccount = yield models_1.AuthQuery.findOne({ username });
        if (!foundAccount) {
            return next((0, http_errors_1.default)(400, 'Account is not exist'));
        }
        const otpSecret = yield utils_1.TokenHandler.signToken({
            auth_id: foundAccount._id,
            type: constants_1.OtpType.ResetPassword,
        }, 'otp_secret');
        const otp = utils_1.OtpHandler.generateOtp(otpSecret);
        third_party_1.NodeMailerParty.mailingResetPassword(username, otp);
        return next((0, utils_1.createHttpSuccess)(200, { otpSecret: otpSecret }));
    }
    catch (error) {
        next(error);
    }
});
exports.resendOtpForConfirmResetPass = resendOtpForConfirmResetPass;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        const foundAccount = yield models_1.AuthQuery.findOne({ username });
        if (!foundAccount) {
            return next((0, http_errors_1.default)(400, 'Account is not exist'));
        }
        const otpSecret = yield utils_1.TokenHandler.signToken({
            auth_id: foundAccount._id,
            type: constants_1.OtpType.ResetPassword,
        }, 'otp_secret');
        const otp = utils_1.OtpHandler.generateOtp(otpSecret);
        third_party_1.NodeMailerParty.mailingResetPassword(username, otp);
        return next((0, utils_1.createHttpSuccess)(200, { otpSecret: otpSecret }));
    }
    catch (error) {
        next(error);
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, confirmPassword } = req.body;
        const validate = utils_1.AuthValidator.passwordValidator.safeParse({
            password,
            confirmPassword,
        });
        if (!validate.success) {
            return next(validate.error);
        }
        const hashPassword = utils_1.HashPasswordHandler.hashPassword(password);
        yield models_1.AuthQuery.updateOne({ username }, { password: hashPassword });
        next((0, utils_1.createHttpSuccess)(200, null));
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const result = yield models_1.AuthQuery.findOne({ username }).populate('role');
        if (!result)
            return next((0, http_errors_1.default)(400, 'Account is not exist'));
        const comparedResult = utils_1.HashPasswordHandler.comparePassword(password, result.password);
        if (!comparedResult)
            return next((0, http_errors_1.default)(400, 'Password is not correct'));
        if (!result.isVerified && !result.verifiedAt)
            return next((0, http_errors_1.default)(401, 'You need to confirm signed up email address'));
        const foundEmployee = yield models_1.EmployeeQuery.findOne({ auth: result._id });
        if (!foundEmployee) {
            return next((0, http_errors_1.default)(400, 'Not found employee'));
        }
        const accessToken = yield utils_1.TokenHandler.signToken({
            auth_id: result._id,
            employee_id: foundEmployee._id,
            identify: result.role.identify,
        }, 'access');
        const refreshToken = yield utils_1.TokenHandler.signToken({
            auth_id: result._id,
            employee_id: foundEmployee._id,
            identify: result.role.identify,
        }, 'refresh');
        return next((0, utils_1.createHttpSuccess)(200, { accessToken, refreshToken }));
    }
    catch (error) {
        return next(error);
    }
});
exports.signIn = signIn;
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { auth_id } = res.locals;
    try {
        const foundAccount = yield models_1.AuthQuery.findOne({ _id: auth_id });
        if (!foundAccount) {
            return next((0, http_errors_1.default)(400, 'Account is not exist'));
        }
        const validateResult = utils_1.AuthValidator.changePasswordValidator.safeParse({
            oldPassword,
            newPassword,
            confirmPassword,
        });
        if (!validateResult.success) {
            return next(validateResult.error);
        }
        const comparePassword = utils_1.HashPasswordHandler.comparePassword(oldPassword, foundAccount.password);
        if (!comparePassword) {
            return next((0, http_errors_1.default)(400, 'Old password is not correct'));
        }
        const hashPassword = utils_1.HashPasswordHandler.hashPassword(newPassword);
        yield models_1.AuthQuery.updateOne({ _id: auth_id }, { password: hashPassword });
        next((0, utils_1.createHttpSuccess)(200));
    }
    catch (error) {
        next(error);
    }
});
exports.changePassword = changePassword;
const getNewAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken, accessToken, authId } = req.body;
    try {
        const decodeAccessToken = utils_1.TokenHandler.decodeToken(accessToken);
        const isNotExpire = utils_1.TimeHandler.checkExpireDate(decodeAccessToken.exp);
        if (isNotExpire) {
            return next((0, utils_1.createHttpSuccess)(200, { accessToken, refreshToken }));
        }
        if (refreshToken) {
            const decodeRefreshToken = utils_1.TokenHandler.decodeToken(refreshToken);
            if (authId !== decodeRefreshToken.auth_id) {
                return next((0, http_errors_1.default)(401, 'This authorization is not yours'));
            }
            const newAccessToken = yield utils_1.TokenHandler.signToken({
                auth_id: decodeRefreshToken.auth_id,
                employee_id: decodeRefreshToken.employee_id,
                identify: decodeRefreshToken.identify,
            }, 'access');
            return next((0, utils_1.createHttpSuccess)(200, { accessToken: newAccessToken, refreshToken }));
        }
        next((0, http_errors_1.default)(401, {}, 'Your sign in period was expired'));
    }
    catch (error) {
        next(error);
    }
});
exports.getNewAccessToken = getNewAccessToken;
