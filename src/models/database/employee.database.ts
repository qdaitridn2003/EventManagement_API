import mongoose, { Schema } from 'mongoose';

type EmployeeSchemaType = {
    _id: Schema.Types.ObjectId;
    auth_id: Schema.Types.ObjectId;
    contract_id: Schema.Types.ObjectId;
    events: Schema.Types.ObjectId[];
    email: string;
    fullName: string;
    dateOfBirth: Date;
    gender: string;
    phoneNumber: string;
    address: string;
    avatar: string;
};
const employeeSchema = new Schema<EmployeeSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        auth_id: { type: Schema.Types.ObjectId, ref: 'auth' },
        contract_id: { type: Schema.Types.ObjectId, ref: 'contract' },
        events: [{ type: Schema.Types.ObjectId, ref: 'event' }],
        email: { type: Schema.Types.String },
        fullName: { type: Schema.Types.String },
        dateOfBirth: { type: Schema.Types.Date },
        gender: { type: Schema.Types.String },
        phoneNumber: { type: Schema.Types.String },
        address: { type: Schema.Types.String },
        avatar: { type: Schema.Types.String },
    },
    {
        timestamps: true,
    },
);

const employeeModel = mongoose.model('employee', employeeSchema);

export default employeeModel;
