import { Schema } from 'mongoose';

export type TimelineSchemaType = {
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
    dateTime: Date;
    location: string;
};
