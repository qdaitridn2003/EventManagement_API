import mongoose, { Schema } from 'mongoose';

type TransportSchemaType = {
    _id: Schema.Types.ObjectId;
    event_id: Schema.Types.ObjectId;
    employee_id: Schema.Types.ObjectId;
    licensePlate: string;
    status: string;
    name: string;
    brand: string;
    color: string;
    availability: string;
    image: string;
};

const transportSchema = new Schema<TransportSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        event_id: { type: Schema.Types.ObjectId, ref: 'event' },
        employee_id: { type: Schema.Types.ObjectId, ref: 'employee' },
        licensePlate: { type: Schema.Types.String },
        status: { type: Schema.Types.String },
        name: { type: Schema.Types.String },
        brand: { type: Schema.Types.String },
        color: { type: Schema.Types.String },
        availability: { type: Schema.Types.String },
        image: { type: Schema.Types.String },
    },
    {
        timestamps: true,
    },
);

const transportModel = mongoose.model('transport', transportSchema);

export default transportModel;
