import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { TokenHandler } from '../utils';

const authorization = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    let token;
    if (authorization) {
        if (authorization.includes('Bearer')) token = authorization.split(' ')[1];
        else token = authorization;
    } else {
        return next(createHttpError(500, 'Invalid authorization'));
    }

    try {
        const verifiedToken = await TokenHandler.verifyToken(token, 'access');
        res.locals.auth_id = verifiedToken.auth_id;
        res.locals.identify = verifiedToken.identify;
        res.locals.employee_id = verifiedToken.employee_id;
        next();
    } catch (error) {
        next(error);
    }
};

export default authorization;
