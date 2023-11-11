import mongoose, { Schema } from 'mongoose';
import { CategorySchemaType } from '../../types';

const categorySchema = new Schema<CategorySchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        name: { type: Schema.Types.String },
        description: { type: Schema.Types.String },
    },
    {
        timestamps: true,
    },
);

categorySchema.index({ name: 'text' });

const categoryModel = mongoose.model('category', categorySchema);

export default categoryModel;
