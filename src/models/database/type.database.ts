import mongoose, { Schema } from 'mongoose';
import { ItemTypeSchemaType } from '../../types';

const typeSchema = new Schema<ItemTypeSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        name: { type: Schema.Types.String },
        description: { type: Schema.Types.String },
    },
    {
        timestamps: true,
    },
);

typeSchema.index({ name: 'text' });

const typeModel = mongoose.model('type', typeSchema);

export default typeModel;
