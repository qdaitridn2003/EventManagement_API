import mongoose, { Schema } from 'mongoose';
import { EventSchemaType } from '../../types';

const eventSchema = new Schema<EventSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        name: { type: Schema.Types.String },
        contract: { type: Schema.Types.ObjectId, ref: 'contract', default: null },
        services: [{ type: Schema.Types.ObjectId, ref: 'service', default: null }],
        employees: [{ type: Schema.Types.ObjectId, ref: 'employee', default: null }],
        timelines: [{ type: Schema.Types.ObjectId, ref: 'timeline', default: null }],
        equipments: [{ type: Schema.Types.ObjectId, ref: 'item', default: null }],
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
