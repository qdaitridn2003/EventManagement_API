import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole } from '../../middlewares';
import { Identify } from '../../constants';

export const categoryRoutes = Express.Router();

categoryRoutes
    .route('/create-category')
    .post(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.createCategory);

categoryRoutes
    .route('/update-category/:_id')
    .put(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.updateCategory);

categoryRoutes
    .route('/delete-category/:_id')
    .delete(
        Authorization,
        CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]),
        Controller.deleteCategory,
    );

categoryRoutes
    .route('/get-list-category')
    .get(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.getListCategory);
