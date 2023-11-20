import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole } from '../../middlewares';
import { Identify } from '../../constants';
export const contractRoutes = Express.Router();

contractRoutes
    .route('/create-contract')
    .post(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.createContract);

contractRoutes
    .route('/update-contract/:_id')
    .put(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.updateContract);

contractRoutes
    .route('/delete-contract/:_id')
    .delete(
        Authorization,
        CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]),
        Controller.deleteContract,
    );

contractRoutes.route('/get-detail-contract/:_id').post(Authorization, Controller.getDetailContract);

contractRoutes.route('/get-list-contract').post(Authorization, Controller.getListContract);
