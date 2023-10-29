import { Schema } from 'mongoose';
import { ItemTypeSchemaType } from './itemType_schema.type';

export type ItemSchemaType = {
    _id: Schema.Types.ObjectId;
    type: Schema.Types.ObjectId | ItemTypeSchemaType;
    name: string;
    description: string;
    quantityTotal: number;
    quantityUsed: number;
    quantityAvailable: number;
    image: string;
};
