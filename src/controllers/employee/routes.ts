import Express from 'express';
import * as Controller from './controller';
import { ImageHandler } from '../../middlewares';

export const employeeRoutes = Express.Router();

employeeRoutes.route('/register-employee-profile').post(Controller.registerEmployeeProfile);
employeeRoutes
    .route('/upload-avatar-employee/:_id')
    .post(ImageHandler.single('avatar'), Controller.uploadEmployeeAvatar);
