import mongoose, { Schema } from 'mongoose';
import { ContractSchemaType } from '../../types';

const contractSchema = new Schema<ContractSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        events: [{ type: Schema.Types.ObjectId, ref: 'event', default: null }],
        discount: { type: Schema.Types.Number, default: 0 },
        name: { type: Schema.Types.String },
        startDate: { type: Schema.Types.Date },
        endDate: { type: Schema.Types.Date },
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
