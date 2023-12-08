import { Schema } from 'mongoose';
import { EventSchemaType } from './event_schema.type';
import { EmployeeSchemaType } from './employee_schema.type';

export type ContractSchemaType = {
    _id: Schema.Types.ObjectId;
    events: Schema.Types.ObjectId[] | EventSchemaType;
    name: string;
    startDate: Date;
    endDate: Date;
    status: string;
    note: string;
    discount: number;
    attachments: string[];
    createdBy: Schema.Types.ObjectId | EmployeeSchemaType;
};
