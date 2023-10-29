import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

type RoleType = number | number[];

const checkRole = (role: RoleType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { identify } = res.locals;
        if (typeof role === 'object') {
            if (role.includes(identify)) return next();
        } else {
            if (identify === role) return next();
        }
        next(createHttpError(401, "You don't have enough permission to do this"));
    };
};

export default checkRole;
