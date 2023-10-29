import { Schema } from 'mongoose';
import { ContractSchemaType } from './contract_schema.type';

export type ClientSchemaType = {
    _id: Schema.Types.ObjectId;
    contracts: Schema.Types.ObjectId[] | ContractSchemaType[];
    email: string;
    fullName: string;
    dateOfBirth: Date;
    gender: string;
    phoneNumber: string;
    address: string;
    avatar: string;
};
