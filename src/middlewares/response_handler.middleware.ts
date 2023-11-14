import { Request, Response, NextFunction } from 'express';
import { ResponsePayloadType } from '../types';

const responseHandler = (responsePayload: ResponsePayloadType, req: Request, res: Response, next: NextFunction) => {
    if (responsePayload instanceof Error) {
        return next(responsePayload);
    } else {
        return res
            .status(responsePayload.statusCode ?? 200)
            .json({
                status: 'Success',
                message: responsePayload.message ?? 'Successfully',
                data: responsePayload.data,
            })
            .flush();
    }
};

export default responseHandler;
