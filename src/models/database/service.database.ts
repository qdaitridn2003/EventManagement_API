import mongoose, { Schema } from 'mongoose';
import { ServiceSchemaType } from '../../types';

const serviceSchema = new Schema<ServiceSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        name: { type: Schema.Types.String },
        description: { type: Schema.Types.String },
    },
    {
        timestamps: true,
    },
);

const serviceModel = mongoose.model('service', serviceSchema);

export default serviceModel;
