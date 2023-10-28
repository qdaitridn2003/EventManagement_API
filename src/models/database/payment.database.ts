import mongoose, { Schema } from 'mongoose';

type PaymentSchemaType = {
    _id: Schema.Types.ObjectId;
    event_id: Schema.Types.ObjectId;
    initialPayment: number;
    remainingPayment: number;
    totalPayment: number;
    discount: number;
    status: string;
    methodPayment: string;
    note: string;
};

const paymentSchema = new Schema<PaymentSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId },
        event_id: { type: Schema.Types.ObjectId, ref: 'event' },
        initialPayment: { type: Schema.Types.Number },
        remainingPayment: { type: Schema.Types.Number },
        totalPayment: { type: Schema.Types.Number },
        discount: { type: Schema.Types.Number },
        status: { type: Schema.Types.String },
        methodPayment: { type: Schema.Types.String },
        note: { type: Schema.Types.String },
    },
    {
        timestamps: true,
    },
);

const paymentModel = mongoose.model('payment', paymentSchema);

export default paymentModel;
