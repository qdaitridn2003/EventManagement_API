import mongoose, { Schema } from 'mongoose';
import { EventSchemaType } from '../../types';

const eventSchema = new Schema<EventSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        name: { type: Schema.Types.String },
        contract: { type: Schema.Types.ObjectId, ref: 'contract' },
        services: [{ type: Schema.Types.ObjectId, ref: 'service' }],
        employees: [{ type: Schema.Types.ObjectId, ref: 'employee' }],
        timelines: [{ type: Schema.Types.ObjectId, ref: 'timeline' }],
        equipments: [{ type: Schema.Types.ObjectId, ref: 'item' }],
        dateTime: { type: Schema.Types.Date },
        status: { type: Schema.Types.String },
        note: { type: Schema.Types.String },
        attachments: [{ type: Schema.Types.String, default: null }],
        images: [{ type: Schema.Types.String, default: null }],
    },
    {
        timestamps: true,
    },
);

const eventModel = mongoose.model('event', eventSchema);

export default eventModel;
