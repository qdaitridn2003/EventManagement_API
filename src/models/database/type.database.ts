import mongoose, { Schema } from 'mongoose';

type KindOfItemSchemaType = {
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
};

const itemTypeSchema = new Schema<KindOfItemSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        name: { type: Schema.Types.String },
        description: { type: Schema.Types.String },
    },
    {
        timestamps: true,
    },
);

const itemTypeModel = mongoose.model('type', itemTypeSchema);

export default itemTypeModel;
