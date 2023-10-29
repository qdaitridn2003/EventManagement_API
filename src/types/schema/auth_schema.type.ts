import { Schema } from 'mongoose';
import { RoleSchemaType } from './role_schema.type';

export type AuthSchemaType = {
    _id: Schema.Types.ObjectId;
    role: Schema.Types.ObjectId | RoleSchemaType;
    username: string;
    password: string;
    isVerified: boolean;
    verifiedAt: Date;
};
