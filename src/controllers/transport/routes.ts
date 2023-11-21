import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole, ImageHandler } from '../../middlewares';
import { Identify } from '../../constants';

export const transportRoutes = Express.Router();

transportRoutes
    .route('/create-transport')
    .post(Authorization, CheckRole([Identify.Admin, Identify.Assistant, Identify.Manager]), Controller.createTransport);

transportRoutes
    .route('/update-transport/:_id')
    .put(Authorization, CheckRole([Identify.Admin, Identify.Assistant, Identify.Manager]), Controller.updateTransport);

transportRoutes
    .route('/delete-transport/:_id')
    .delete(
        Authorization,
        CheckRole([Identify.Admin, Identify.Assistant, Identify.Manager]),
        Controller.deleteTransport,
    );

transportRoutes.route('/get-list-transport').get(Authorization, Controller.getListTransport);

transportRoutes
    .route('/get-transport-detail/:_id')
    .get(
        Authorization,
        CheckRole([Identify.Admin, Identify.Assistant, Identify.Manager]),
        Controller.getTransportDetail,
    );

transportRoutes
    .route('/upload-image-transport/:_id')
    .post(
        ImageHandler.single('image'),
        Authorization,
        CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]),
        Controller.uploadImageTransport,
    );
