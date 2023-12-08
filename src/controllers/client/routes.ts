import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole, ImageHandler } from '../../middlewares';
import { Identify } from '../../constants';

export const clientRoutes = Express.Router();

clientRoutes
    .route('/create-info-client')
    .post(
        Authorization,
        CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]),
        Controller.createInfoClient,
    );

clientRoutes
    .route('/update-info-client/:_id')
    .put(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.updateInfoClient);

clientRoutes
    .route('/delete-client/:_id')
    .delete(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.deleteClient);

clientRoutes
    .route('/get-client-detail/:_id')
    .get(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.getClientDetail);

clientRoutes
    .route('/get-client-list')
    .get(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.getListClient);

clientRoutes
    .route('/upload-avatar-client/:_id')
    .post(
        ImageHandler.single('avatar'),
        Authorization,
        CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]),
        Controller.uploadAvatarClient,
    );
