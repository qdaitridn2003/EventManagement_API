import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole } from '../../middlewares';
import { Role } from '../../constants';

export const authRoutes = Express.Router();

authRoutes.route('/sign-up').post(Controller.signUpAccount);
authRoutes.route('/verify-account').put(Controller.verifyAccount);
authRoutes
    .route('/verify-otp-forgot-password')
    .post(Controller.verifyOtpForResetPassword);
authRoutes
    .route('/resend-otp/reset-password')
    .post(Controller.resendOtpForConfirmResetPass);
authRoutes
    .route('/resend-otp/confirm-email')
    .post(Controller.resendOtpForConfirmEmail);
authRoutes.route('/sign-in').post(Controller.signIn);
authRoutes.route('/forgot-password').post(Controller.forgotPassword);
authRoutes.route('/reset-password').put(Controller.resetPassword);
authRoutes
    .route('/change-password')
    .put(
        Authorization,
        CheckRole(Role.employeeRole),
        Controller.changePassword,
    );
