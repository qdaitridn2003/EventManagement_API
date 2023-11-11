import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole, ImageHandler } from '../../middlewares';
import { Identify } from '../../constants';

export const itemRoutes = Express.Router();

itemRoutes
    .route('/create-info-item')
    .post(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.createInfoItem);

itemRoutes
    .route('/update-info-item/:_id')
    .put(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.updateInfoItem);

itemRoutes
    .route('/delete-info-item/:_id')
    .delete(
        Authorization,
        CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]),
        Controller.deleteInfoItem,
    );

itemRoutes
    .route('/get-detail-item/:_id')
    .get(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.getDetailItem);

itemRoutes
    .route('/get-list-item')
    .get(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.getListItem);

itemRoutes
    .route('/upload-image-item/:_id')
    .post(
        ImageHandler.single('image'),
        Authorization,
        CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]),
        Controller.uploadImageItem,
    );
