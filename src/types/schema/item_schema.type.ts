import { Schema } from 'mongoose';
import { CategorySchemaType } from './category_schema.type';

export type ItemSchemaType = {
    _id: Schema.Types.ObjectId;
    category: Schema.Types.ObjectId | CategorySchemaType;
    name: string;
    description: string;
    quantityTotal: number;
    quantityUsed: number;
    quantityAvailable: number;
    image: string;
};
