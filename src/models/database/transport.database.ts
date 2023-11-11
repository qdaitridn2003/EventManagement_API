import mongoose, { Schema } from 'mongoose';
import { TransportSchemaType } from '../../types';

const transportSchema = new Schema<TransportSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        event: { type: Schema.Types.ObjectId, ref: 'event' },
        employee: { type: Schema.Types.ObjectId, ref: 'employee' },
        licensePlate: { type: Schema.Types.String },
        status: { type: Schema.Types.String },
        name: { type: Schema.Types.String },
        brand: { type: Schema.Types.String },
        color: { type: Schema.Types.String },
        availability: { type: Schema.Types.String },
        image: { type: Schema.Types.String, default: null },
    },
    {
        timestamps: true,
    },
);

const transportModel = mongoose.model('transport', transportSchema);

export default transportModel;
