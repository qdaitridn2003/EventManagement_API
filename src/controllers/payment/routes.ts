import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole } from '../../middlewares';
import { Identify } from '../../constants';

export const paymentRoutes = Express.Router();

paymentRoutes
    .route('/update-payment/:_id')
    .put(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.updatePayment);

paymentRoutes
    .route('/delete-payment/:_id')
    .delete(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.deletePayment);

paymentRoutes
    .route('/get-detail-payment/:_id')
    .get(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.getDetailPayment);

paymentRoutes
    .route('/get-list-payment')
    .delete(
        Authorization,
        CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]),
        Controller.getListPayment,
    );
