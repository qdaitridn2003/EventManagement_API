import { Schema } from 'mongoose';

export type PaymentSchemaType = {
    _id: Schema.Types.ObjectId;
    initialPayment: number;
    remainingPayment: number;
    totalPayment: number;
    status: string;
    discount: number;
    methodPayment: string;
    note: string;
};
