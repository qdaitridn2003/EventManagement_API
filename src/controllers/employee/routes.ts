import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole, ImageHandler } from '../../middlewares';
import { Identify } from '../../constants';

export const employeeRoutes = Express.Router();

employeeRoutes.route('/register-employee-profile').post(Controller.registerEmployeeProfile);

employeeRoutes.route('/update-employee-profile').put(Authorization, Controller.updateEmployeeProfile);

employeeRoutes.route('/get-employee-profile').get(Authorization, Controller.getEmployeeProfile);

employeeRoutes.route('/get-employee-profile/:_id').get(Authorization, Controller.getEmployeeProfile);

employeeRoutes
    .route('/get-employee-list')
    .get(Authorization, CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant]), Controller.getEmployeeList);

employeeRoutes.route('/upload-avatar-employee').post(ImageHandler.single('avatar'), Controller.uploadEmployeeAvatar);
