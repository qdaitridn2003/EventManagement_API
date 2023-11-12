import { Request, Response, NextFunction } from 'express';
import { createHttpSuccess, searchHelper } from '../../utils';
import { EventQuery } from '../../models';

export const testCheckRole = (req: Request, res: Response, next: NextFunction) => {
    const { auth_id, identify } = res.locals;
    return next(createHttpSuccess(200, { auth_id, identify }));
};

export const testPaginationWithPopulate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await EventQuery.find({ name: 'hello' }).populate([
            {
                path: 'employees',
                options: { limit: 10, skip: 1 },
            },
            { path: 'equipment', options: { limit: 10, skip: 1 } },
        ]);
    } catch (error) {}
};
