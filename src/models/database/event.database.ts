import mongoose, { Schema } from 'mongoose';

type EventSchemaType = {
    _id: Schema.Types.ObjectId;
    contract_id: Schema.Types.ObjectId;
    employees: Schema.Types.ObjectId[];
    services: Schema.Types.ObjectId[];
    timelines: Schema.Types.ObjectId[];
    equipments: Schema.Types.ObjectId[];
    dateTime: Date;
    status: string;
    note: string;
    attachments: string[];
    images: string[];
};

const eventSchema = new Schema<EventSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        contract_id: { type: Schema.Types.ObjectId, ref: 'contract' },
        services: [{ type: Schema.Types.ObjectId, ref: 'service' }],
        employees: [{ type: Schema.Types.ObjectId, ref: 'employee' }],
        timelines: [{ type: Schema.Types.ObjectId, ref: 'timeline' }],
        equipments: [{ type: Schema.Types.ObjectId, ref: 'item' }],
        dateTime: { type: Schema.Types.Date },
        status: { type: Schema.Types.String },
        note: { type: Schema.Types.String },
        attachments: [{ type: Schema.Types.String }],
        images: [{ type: Schema.Types.String }],
    },
    {
        timestamps: true,
    },
);

const eventModel = mongoose.model('event', eventSchema);

export default eventModel;
