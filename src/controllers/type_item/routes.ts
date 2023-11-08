import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole } from '../../middlewares';
import { Identify } from '../../constants';

export const typeItemRoutes = Express.Router();

typeItemRoutes
    .route('/create-type-item')
    .post(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.createTypeItem);

typeItemRoutes
    .route('/update-type-item/:_id')
    .put(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.updateTypeItem);

typeItemRoutes
    .route('/delete-type-item/:_id')
    .delete(
        Authorization,
        CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]),
        Controller.deleteTypeItem,
    );

typeItemRoutes
    .route('/list-type-item')
    .get(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.getListTypeItem);
