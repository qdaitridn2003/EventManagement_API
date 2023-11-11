import { Schema } from 'mongoose';

export type CategorySchemaType = {
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
};
