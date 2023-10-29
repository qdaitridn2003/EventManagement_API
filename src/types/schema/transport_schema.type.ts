import { Schema } from 'mongoose';
import { EventSchemaType } from './event_schema.type';
import { EmployeeSchemaType } from './employee_schema.type';

export type TransportSchemaType = {
    _id: Schema.Types.ObjectId;
    event: Schema.Types.ObjectId | EventSchemaType;
    employee: Schema.Types.ObjectId | EmployeeSchemaType;
    licensePlate: string;
    status: string;
    name: string;
    brand: string;
    color: string;
    availability: string;
    image: string;
};
