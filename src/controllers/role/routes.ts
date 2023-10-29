import Express from 'express';
import * as Controllers from './controller';
import { Authorization, CheckRole } from '../../middlewares';
import { Identify } from '../../constants';

export const roleRoutes = Express.Router();

roleRoutes.route('/get-list-role').get(Controllers.getListRole);
roleRoutes.route('/create').post(Authorization, CheckRole(Identify.Admin), Controllers.createRole);
roleRoutes.route('/edit').put(Authorization, CheckRole(Identify.Admin), Controllers.editRole);
roleRoutes
    .route('/delete')
    .delete(Authorization, CheckRole(Identify.Admin), Controllers.deleteRole);
