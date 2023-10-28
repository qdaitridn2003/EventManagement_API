import mongoose, { Schema } from 'mongoose';

type ClientSchemaType = {
    _id: Schema.Types.ObjectId;
    contracts: Schema.Types.ObjectId[];
    email: string;
    fullName: string;
    dateOfBirth: Date;
    gender: string;
    phoneNumber: string;
    address: string;
    avatar: string;
};

const clientSchema = new Schema<ClientSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        contracts: [{ type: Schema.Types.ObjectId, ref: 'contract' }],
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

const clientModel = mongoose.model('client', clientSchema);

export default clientModel;
