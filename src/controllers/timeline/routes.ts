import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole } from '../../middlewares';
import { Identify } from '../../constants';

export const timelineRoutes = Express.Router();

timelineRoutes
    .route('/create-timeline')
    .post(Authorization, CheckRole([Identify.Admin, Identify.Assistant, Identify.Manager]), Controller.createTimeline);

timelineRoutes
    .route('/update-timeline/:_id')
    .put(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.updateTimeLine);

timelineRoutes
    .route('/delete-timeline/:_id')
    .delete(
        Authorization,
        CheckRole([Identify.Admin, Identify.Assistant, Identify.Manager]),
        Controller.deleteTimeline,
    );
timelineRoutes.route('/get-list-timeline').get(Authorization, Controller.getListTimeline);

timelineRoutes
    .route('/get-timeline-detail/:_id')
    .get(
        Authorization,
        CheckRole([Identify.Admin, Identify.Assistant, Identify.Manager]),
        Controller.getTimelineDetail,
    );
