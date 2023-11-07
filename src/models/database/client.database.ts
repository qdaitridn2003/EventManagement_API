import mongoose, { Schema } from 'mongoose';
import { ClientSchemaType } from '../../types';

const clientSchema = new Schema<ClientSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        contracts: [{ type: Schema.Types.ObjectId, ref: 'contract', default: null }],
        email: { type: Schema.Types.String },
        fullName: { type: Schema.Types.String },
        dateOfBirth: { type: Schema.Types.Date },
        gender: { type: Schema.Types.String },
        phoneNumber: { type: Schema.Types.String },
        address: { type: Schema.Types.String },
        avatar: { type: Schema.Types.String },
    },
    {
        timestamps: true,
    },
);

clientSchema.index({ email: 'text', fullName: 'text', gender: 'text' });

const clientModel = mongoose.model('client', clientSchema);

export default clientModel;
