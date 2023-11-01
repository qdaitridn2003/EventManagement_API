import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole } from '../../middlewares';
import { Identify } from '../../constants';

export const roleRoutes = Express.Router();

roleRoutes.route('/get-list-role').get(Controller.getListRole);
roleRoutes.route('/create-role').post(Authorization, CheckRole(Identify.Admin), Controller.createRole);
roleRoutes.route('/edit-role/:_id').put(Authorization, CheckRole(Identify.Admin), Controller.editRole);
roleRoutes.route('/delete-role/:_id').delete(Authorization, CheckRole(Identify.Admin), Controller.deleteRole);
