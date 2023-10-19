import mongoose, { Schema, mongo } from 'mongoose';

type RoleSchemaType = {
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
};

const roleSchema = new Schema<RoleSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        name: { type: Schema.Types.String },
        description: { type: Schema.Types.String },
    },
    {
        timestamps: true,
    },
);

const roleModel = mongoose.model('role', roleSchema);

export default roleModel;
