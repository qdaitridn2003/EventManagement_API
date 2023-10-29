import { Schema } from 'mongoose';

export type RoleSchemaType = {
    _id: Schema.Types.ObjectId;
    name: string;
    identify: number;
    description: string;
};
