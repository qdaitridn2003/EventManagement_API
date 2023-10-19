import { NextFunction, Request, Response } from 'express';
import { RoleType } from '../types';
import { RoleQuery } from '../models';
import createHttpError from 'http-errors';

const checkRole = (role: RoleType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { role_id } = res.locals;
            const foundRoleName = await RoleQuery.findOne({ _id: role_id });
            if (foundRoleName?.name === role) {
                next();
            } else {
                next(
                    createHttpError(
                        401,
                        "You don't have enough permission to do this",
                    ),
                );
            }
        } catch (error) {
            next(error);
        }
    };
};

export default checkRole;
