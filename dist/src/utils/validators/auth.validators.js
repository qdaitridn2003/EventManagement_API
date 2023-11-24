"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidator = exports.passwordValidator = exports.registerAccountValidator = void 0;
const zod_1 = require("zod");
exports.registerAccountValidator = zod_1.z.object({
    username: zod_1.z.string().email({
        message: 'Username must be an email address',
    }),
    password: zod_1.z.string()
        .min(6, { message: 'Password must be at least have 6 characters' })
        .regex(new RegExp('^[a-z0-9]*$'), {
        message: 'Password must be not have special characters or capital letters',
    }),
    confirmPassword: zod_1.z.string()
        .min(6, {
        message: 'Confirm password must be at least have 6 characters',
    })
        .regex(new RegExp('^[a-z0-9]*$'), {
        message: 'Confirm password must be not have special characters or capital letters',
    }),
}).refine((data) => data.confirmPassword === data.password, {
    path: ['confirmPassword'],
    message: 'Confirm password must be matches to the current password',
});
exports.passwordValidator = zod_1.z.object({
    password: zod_1.z.string()
        .min(6, { message: 'Password must be at least have 6 characters' })
        .regex(new RegExp('^[a-z0-9]*$'), {
        message: 'Password must be not have special characters or capital letters',
    }),
    confirmPassword: zod_1.z.string()
        .min(6, {
        message: 'Confirm password must be at least have 6 characters',
    })
        .regex(new RegExp('^[a-z0-9]*$'), {
        message: 'Confirm password must be not have special characters or capital letters',
    }),
}).refine((data) => data.confirmPassword === data.password, {
    path: ['confirmPassword'],
    message: 'Confirm password must be matches to the current password',
});
exports.changePasswordValidator = zod_1.z.object({
    oldPassword: zod_1.z.string()
        .min(6, { message: 'Old password must be at least have 6 characters' })
        .regex(new RegExp('^[a-z0-9]*$'), {
        message: 'Old password must be not have special characters or capital letters',
    }),
    newPassword: zod_1.z.string()
        .min(6, { message: 'New password must be at least have 6 characters' })
        .regex(new RegExp('^[a-z0-9]*$'), {
        message: 'New password must be not have special characters or capital letters',
    }),
    confirmPassword: zod_1.z.string()
        .min(6, {
        message: 'Confirm password must be at least have 6 characters',
    })
        .regex(new RegExp('^[a-z0-9]*$'), {
        message: 'Confirm password must be not have special characters or capital letters',
    }),
}).refine((data) => data.confirmPassword === data.newPassword, {
    path: ['confirmPassword'],
    message: 'Confirm password must be matches to the new password',
});
