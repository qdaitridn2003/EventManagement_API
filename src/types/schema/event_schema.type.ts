import { Schema } from 'mongoose';
import { EmployeeSchemaType } from './employee_schema.type';
import { TimelineSchemaType } from './timeline_schema.type';
import { ServiceSchemaType } from './service_schema.type';
import { ItemSchemaType } from './item_schema.type';
import { PaymentSchemaType } from './payment_schema.type';
import { TransportSchemaType } from './transport_schema.type';

export type EventSchemaType = {
    _id: Schema.Types.ObjectId;
    employees: Schema.Types.ObjectId[] | EmployeeSchemaType[];
    services: Schema.Types.ObjectId[] | ServiceSchemaType[];
    timelines: Schema.Types.ObjectId[] | TimelineSchemaType[];
    equipments: Schema.Types.ObjectId[] | ItemSchemaType[];
    transports: Schema.Types.ObjectId[] | TransportSchemaType[];
    payment: Schema.Types.ObjectId | PaymentSchemaType;
    name: string;
    dateTime: Date;
    status: string;
    note: string;
    attachments: string[];
    images: string[];
};
