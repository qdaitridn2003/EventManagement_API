import Express from 'express';
import * as Controllers from './controller';
import { Authorization, CheckRole } from '../../middlewares';
import { Identify } from '../../constants';

export const roleRoutes = Express.Router();

roleRoutes.route('/get-list-role').get(Controllers.getListRole);
roleRoutes.route('/create-role').post(Authorization, CheckRole(Identify.Admin), Controllers.createRole);
roleRoutes.route('/edit-role/:_id').put(Authorization, CheckRole(Identify.Admin), Controllers.editRole);
roleRoutes.route('/delete-role/:_id').delete(Authorization, CheckRole(Identify.Admin), Controllers.deleteRole);
