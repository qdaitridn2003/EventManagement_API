import { Request, Response, NextFunction } from 'express';
import { ErrorResponsePayloadType } from '../types';
import { ZodError } from 'zod';
import { JsonWebTokenError } from 'jsonwebtoken';

const errorHandler = (
    errorPayload: ErrorResponsePayloadType,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (errorPayload instanceof ZodError) {
        const listErrors = errorPayload.errors;
        const listErrorMessage = listErrors.map((error) => error.message);
        return res.status(400).json({
            status: 'failure',
            message:
                listErrorMessage.length > 1
                    ? listErrorMessage
                    : listErrorMessage[0],
        });
    } else if (errorPayload instanceof JsonWebTokenError) {
        if (errorPayload.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'failure',
                message: 'Your sign in period was expired',
            });
        } else {
            return res.status(401).json({
                status: 'failure',
                message: 'Invalid token',
            });
        }
    } else {
        return res.status(errorPayload.statusCode ?? 500).json({
            status: 'failure',
            message: errorPayload.message,
        });
    }
};

export default errorHandler;
