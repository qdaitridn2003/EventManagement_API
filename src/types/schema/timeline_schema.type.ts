import { Schema } from 'mongoose';

export type TimelineSchemaType = {
    _id: Schema.Types.ObjectId;
    description: string;
    dateTime: Date;
    location: string;
};
