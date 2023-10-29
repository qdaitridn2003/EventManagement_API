import { Schema } from 'mongoose';

export type ItemTypeSchemaType = {
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
};
