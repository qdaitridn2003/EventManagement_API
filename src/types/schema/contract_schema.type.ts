import { Schema } from 'mongoose';
import { PaymentSchemaType } from './payment_schema.type';

export type ContractSchemaType = {
    _id: Schema.Types.ObjectId;
    name: string;
    startDate: Date;
    endDate: Date;
    payment: Schema.Types.ObjectId | PaymentSchemaType;
    status: string;
    note: string;
    attachments: string[];
};
