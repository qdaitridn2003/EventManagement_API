import mongoose, { Schema } from 'mongoose';
import { ItemSchemaType } from '../../types';

const itemSchema = new Schema<ItemSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        category: { type: Schema.Types.ObjectId, ref: 'category' },
        name: { type: Schema.Types.String },
        description: { type: Schema.Types.String },
        quantityTotal: { type: Schema.Types.Number, default: 0 },
        quantityUsed: { type: Schema.Types.Number, default: 0 },
        quantityAvailable: { type: Schema.Types.Number, default: 0 },
        image: { type: Schema.Types.String, default: null },
    },
    {
        timestamps: true,
    },
);

const itemModel = mongoose.model('item', itemSchema);

export default itemModel;
