import { Schema } from 'mongoose';
import { EventSchemaType } from './event_schema.type';

export type TimelineSchemaType = {
    _id: Schema.Types.ObjectId;
    event: Schema.Types.ObjectId | EventSchemaType;
    description: string;
    dateTime: Date;
    location: string;
};
