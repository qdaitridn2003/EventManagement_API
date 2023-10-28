import mongoose, { Schema } from 'mongoose';

type ItemSchemaType = {
    _id: Schema.Types.ObjectId;
    type_id: Schema.Types.ObjectId;
    name: string;
    description: string;
    quantityTotal: number;
    quantityUsed: number;
    quantityAvailable: number;
    image: string;
};

const itemSchema = new Schema<ItemSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        type_id: { type: Schema.Types.ObjectId, ref: 'type' },
        name: { type: Schema.Types.String },
        description: { type: Schema.Types.String },
        quantityTotal: { type: Schema.Types.Number },
        quantityUsed: { type: Schema.Types.Number },
        quantityAvailable: { type: Schema.Types.Number },
        image: { type: Schema.Types.String },
    },
    {
        timestamps: true,
    },
);

const itemModel = mongoose.model('item', itemSchema);

export default itemModel;
