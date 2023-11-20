import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole } from '../../middlewares';
import { Identify } from '../../constants';
export const contractRoutes = Express.Router();

contractRoutes
    .route('/create-contract')
    .post(
        Authorization,
        CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant, Identify.Employee]),
        Controller.createContract,
    );
