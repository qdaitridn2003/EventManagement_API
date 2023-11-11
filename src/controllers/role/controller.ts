import { Request, Response, NextFunction } from 'express';
import { RoleQuery } from '../../models';
import { createHttpSuccess } from '../../utils';
import createHttpError from 'http-errors';

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
    const { _id } = req.params;
    const { name, description, identify } = req.body;

    try {
        const foundRole = await RoleQuery.findOne({ _id });
        if (!foundRole) {
            return next(createHttpError(404, 'Not found role'));
        }
        await RoleQuery.updateOne({ _id }, { name, description, identify });
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};

export const deleteRole = async (req: Request, response: Response, next: NextFunction) => {
    const { _id } = req.params;

    try {
        const foundRole = await RoleQuery.findOne({ _id });
        if (!foundRole) {
            return next(createHttpError(404, 'Not found role'));
        }
        await RoleQuery.deleteOne({ _id });
        return next(createHttpSuccess(200));
    } catch (error) {
        return next(error);
    }
};

export const getListRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await RoleQuery.find({ identify: { $eq: 4 } })
            .select({ createdAt: false, updatedAt: false, __v: false })
            .sort('identify');
        return next(createHttpSuccess(200, result));
    } catch (error) {
        return next(error);
    }
};
