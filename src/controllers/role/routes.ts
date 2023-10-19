import Express from 'express';
import * as Controllers from './controller';
import { Authorization, CheckRole } from '../../middlewares';
import { Role } from '../../constants';

export const roleRoutes = Express.Router();

roleRoutes.route('/get-list-role').get(Controllers.getListRole);
roleRoutes
    .route('/create')
    .post(Authorization, CheckRole(Role.adminRole), Controllers.createRole);
roleRoutes
    .route('/edit')
    .put(Authorization, CheckRole(Role.adminRole), Controllers.editRole);
roleRoutes
    .route('/delete')
    .delete(Authorization, CheckRole(Role.adminRole), Controllers.deleteRole);
