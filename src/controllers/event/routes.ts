import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole, ImageHandler } from '../../middlewares';
import { Identify } from '../../constants';

export const eventRoutes = Express.Router();

eventRoutes
    .route('/create-event')
    .post(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.createEvent);

eventRoutes
    .route('/update-event/:_id')
    .put(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.updateEvent);

eventRoutes
    .route('/delete-event/:_id')
    .delete(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.deleteEvent);

eventRoutes.route('/get-detail-event/:_id').get(Authorization, Controller.getDetailEvent);

eventRoutes.route('/get-list-event').get(Authorization, Controller.getListEvent);

eventRoutes
    .route('/upload-event-image/:_id')
    .post(
        Authorization,
        ImageHandler.single('image'),
        CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]),
        Controller.uploadImageEvent,
    );

eventRoutes
    .route('/upload-event-images/:_id')
    .post(
        Authorization,
        ImageHandler.array('images'),
        CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]),
        Controller.uploadImagesEvent,
    );
