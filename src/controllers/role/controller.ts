import { Request, Response, NextFunction } from 'express';
import { RoleQuery } from '../../models';
import { createHttpSuccess } from '../../utils';

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, identify } = req.body;
    try {
        const result = await RoleQuery.create({ name, description, identify });
        next(createHttpSuccess(200, result));
    } catch (error) {
        next(error);
    }
};

export const editRole = async (req: Request, res: Response, next: NextFunction) => {
    const { _id, name, description, identify } = req.body;

    try {
        const result = await RoleQuery.updateOne({ _id }, { name, description });
        return next(createHttpSuccess(200, result));
    } catch (error) {
        return next(error);
    }
};

export const deleteRole = async (req: Request, response: Response, next: NextFunction) => {
    const { _id } = req.body;

    try {
        const result = await RoleQuery.findOneAndDelete({ _id });
        return next(createHttpSuccess(200, result));
    } catch (error) {
        return next(error);
    }
};

export const getListRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await RoleQuery.find();
        return next(createHttpSuccess(200, result));
    } catch (error) {
        return next(error);
    }
};
