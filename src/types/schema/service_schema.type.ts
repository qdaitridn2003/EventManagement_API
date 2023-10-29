import { Schema } from 'mongoose';

export type ServiceSchemaType = {
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
};
