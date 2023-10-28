import mongoose, { Schema } from 'mongoose';

type ContractSchemaType = {
    _id: Schema.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    initialPayment: number;
    remainingPayment: number;
    contractPayment: number;
    status: string;
    note: string;
    attachments: string[];
};

const contractSchema = new Schema<ContractSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        startDate: { type: Schema.Types.Date },
        endDate: { type: Schema.Types.Date },
        initialPayment: { type: Schema.Types.Number, default: 0 },
        remainingPayment: { type: Schema.Types.Number, default: 0 },
        contractPayment: { type: Schema.Types.Number, default: 0 },
        status: { type: Schema.Types.String },
        note: { type: Schema.Types.String, default: '' },
        attachments: [{ type: Schema.Types.String, default: null }],
    },
    {
        timestamps: true,
    },
);

const contractModel = mongoose.model('contract', contractSchema);

export default contractModel;
