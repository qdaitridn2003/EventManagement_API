import { Schema } from 'mongoose';
import { ContractSchemaType } from './contract_schema.type';

export type EmployeeSchemaType = {
    _id: Schema.Types.ObjectId;
    auth: Schema.Types.ObjectId;
    contract: Schema.Types.ObjectId | ContractSchemaType;
    email: string;
    fullName: string;
    dateOfBirth: Date;
    gender: string;
    phoneNumber: string;
    address: string;
    avatar: string;
};
