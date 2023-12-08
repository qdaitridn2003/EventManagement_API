import mongoose, { Schema } from 'mongoose';
import { EmployeeSchemaType } from '../../types';

const employeeSchema = new Schema<EmployeeSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        auth: { type: Schema.Types.ObjectId, ref: 'auth', default: null },
        email: { type: Schema.Types.String },
        fullName: { type: Schema.Types.String },
        dateOfBirth: { type: Schema.Types.Date },
        gender: { type: Schema.Types.String },
        phoneNumber: { type: Schema.Types.String },
        address: { type: Schema.Types.String },
        avatar: { type: Schema.Types.String, default: null },
    },
    {
        timestamps: true,
    },
);

const employeeModel = mongoose.model('employee', employeeSchema);

export default employeeModel;
