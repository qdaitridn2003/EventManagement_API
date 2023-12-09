import mongoose, { Schema } from 'mongoose';
import { ContractSchemaType } from '../../types';

const contractSchema = new Schema<ContractSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        events: [{ type: Schema.Types.ObjectId, ref: 'event', default: null }],
        name: { type: Schema.Types.String },
        startDate: { type: Schema.Types.Date },
        endDate: { type: Schema.Types.Date },
        status: { type: Schema.Types.String },
        note: { type: Schema.Types.String, default: '' },
        createdBy: { type: Schema.Types.ObjectId, ref: 'employee', default: null },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'employee', default: null },
        attachments: [{ type: Schema.Types.String, default: null }],
    },
    {
        timestamps: true,
    },
);

const contractModel = mongoose.model('contract', contractSchema);

export default contractModel;
