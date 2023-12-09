import { Schema } from 'mongoose';
import { EmployeeSchemaType } from './employee_schema.type';

export type TransportSchemaType = {
    _id: Schema.Types.ObjectId;
    employee: Schema.Types.ObjectId | EmployeeSchemaType;
    licensePlate: string;
    status: string;
    name: string;
    brand: string;
    color: string;
    availability: string;
    image: string;
};
