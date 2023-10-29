import { Request, Response, NextFunction } from 'express';
import { createHttpSuccess } from '../../utils';

export const testCheckRole = (req: Request, res: Response, next: NextFunction) => {
    const { auth_id, identify } = res.locals;
    return next(createHttpSuccess(200, { auth_id, identify }));
};
