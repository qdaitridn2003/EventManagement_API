import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole } from '../../middlewares';
import { Identify } from '../../constants';

export const serviceRoutes = Express.Router();

serviceRoutes
    .route('/create-service')
    .post(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.createService);
serviceRoutes
    .route('/update-service/:_id')
    .put(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.updateService);

serviceRoutes
    .route('/delete-service/:_id')
    .delete(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.deleteService);
serviceRoutes
    .route('/get-list-service')
    .get(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.getListService);
