import { Schema } from 'mongoose';
import { AuthSchemaType } from './auth_schema.type';

export type EmployeeSchemaType = {
    _id: Schema.Types.ObjectId;
    auth: Schema.Types.ObjectId | AuthSchemaType;
    email: string;
    fullName: string;
    dateOfBirth: Date;
    gender: string;
    phoneNumber: string;
    address: string;
    avatar: string;
};
