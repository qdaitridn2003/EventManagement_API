import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole } from '../../middlewares';
import { Identify } from '../../constants';

export const eventRoutes = Express.Router();

eventRoutes
    .route('/create-event')
    .post(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.createEvent);
