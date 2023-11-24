import { HttpError } from 'http-errors';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ZodError } from 'zod';

export type ErrorResponsePayloadType = ZodError | HttpError | JsonWebTokenError;
export type SuccessResponsePayloadType = {
    statusCode: number;
    data: object | object[];
    message: string;
};

export type ResponsePayloadType = ErrorResponsePayloadType | SuccessResponsePayloadType;
