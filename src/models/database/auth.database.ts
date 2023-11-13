import mongoose, { Schema } from 'mongoose';
import { AuthSchemaType } from '../../types';
import { isNull } from 'util';

const authSchema = new Schema<AuthSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        username: { type: Schema.Types.String },
        password: { type: Schema.Types.String },
        role: { type: Schema.Types.ObjectId, ref: 'role', default: null },
        isVerified: { type: Schema.Types.Boolean, default: false },
        verifiedAt: { type: Schema.Types.Date, default: null },
    },
    {
        timestamps: true,
    },
);

const authModel = mongoose.model('auth', authSchema);

export default authModel;
