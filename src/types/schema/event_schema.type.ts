import { Schema } from 'mongoose';
import { EmployeeSchemaType } from './employee_schema.type';
import { TimelineSchemaType } from './timeline_schema.type';
import { ServiceSchemaType } from './service_schema.type';
import { ItemSchemaType } from './item_schema.type';

export type EventSchemaType = {
    _id: Schema.Types.ObjectId;
    contract: Schema.Types.ObjectId;
    employees: Schema.Types.ObjectId[] | EmployeeSchemaType[];
    services: Schema.Types.ObjectId[] | ServiceSchemaType[];
    timelines: Schema.Types.ObjectId[] | TimelineSchemaType[];
    equipments: Schema.Types.ObjectId[] | ItemSchemaType[];
    dateTime: Date;
    status: string;
    note: string;
    attachments: string[];
    images: string[];
};
