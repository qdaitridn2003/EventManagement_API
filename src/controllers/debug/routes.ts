import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole } from '../../middlewares';
import { Identify } from '../../constants';

export const debugRoutes = Express.Router();

debugRoutes.route('/test-check-role').get(Authorization, CheckRole(Identify.Admin), Controller.testCheckRole);
