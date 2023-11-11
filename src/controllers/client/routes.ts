import Express from 'express';
import * as controller from './controller';
import { Authorization, CheckRole, ImageHandler } from '../../middlewares';
import { Identify } from '../../constants';

export const clientRoutes = Express.Router();

clientRoutes
    .route('/create-info-client')
    .post(
        Authorization,
        CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]),
        controller.createInfoClient,
    );

clientRoutes
    .route('/update-info-client/:_id')
    .put(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), controller.updateInfoClient);

clientRoutes
    .route('/delete-client/:_id')
    .delete(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), controller.deleteClient);

clientRoutes
    .route('/get-client-detail/:_id')
    .get(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), controller.getClientDetail);

clientRoutes
    .route('/get-client-list')
    .get(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), controller.getListClient);

clientRoutes
    .route('/upload-avatar-client/:_id')
    .post(
        ImageHandler.single('avatar'),
        Authorization,
        CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]),
        controller.uploadAvatarClient,
    );
