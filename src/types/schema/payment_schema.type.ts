import { Schema } from 'mongoose';
import { EventSchemaType } from './event_schema.type';

export type PaymentSchemaType = {
    _id: Schema.Types.ObjectId;
    event: Schema.Types.ObjectId | EventSchemaType;
    initialPayment: number;
    remainingPayment: number;
    totalPayment: number;
    discount: string;
    status: string;
    methodPayment: string;
    note: string;
};
