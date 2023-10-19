import mongoose, { Schema } from 'mongoose';

type AuthSchemaType = {
    _id: Schema.Types.ObjectId;
    role_id: Schema.Types.ObjectId;
    username: string;
    password: string;
    isVerified: boolean;
    verifiedAt: Date;
};

const authSchema = new Schema<AuthSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        username: { type: Schema.Types.String },
        password: { type: Schema.Types.String },
        role_id: { type: Schema.Types.ObjectId, ref: 'role' },
        isVerified: { type: Schema.Types.Boolean, default: false },
        verifiedAt: { type: Schema.Types.Date, default: null },
    },
    {
        timestamps: true,
    },
);

const authModel = mongoose.model('auth', authSchema);

export default authModel;
