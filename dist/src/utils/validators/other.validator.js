"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerInfoValidator = void 0;
const zod_1 = require("zod");
exports.registerInfoValidator = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Email must an email address' }).optional(),
    gender: zod_1.z.enum(['male', 'female'], {
        errorMap: (issue, context) => {
            return {
                message: 'Gender must be male or female',
            };
        },
    }),
    phoneNumber: zod_1.z.string()
        .max(10, {
        message: 'Phone number must be have 10 digits or lower Phone number must be have lower 10 digits',
    })
        .regex(new RegExp('^[0-9]*$'), { message: 'Phone number must be a digit' }),
});
