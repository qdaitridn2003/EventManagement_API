import mongoose, { Schema } from 'mongoose';
import { PaymentSchemaType } from '../../types';

const paymentSchema = new Schema<PaymentSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId },
        event: { type: Schema.Types.ObjectId, ref: 'event', default: null },
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
