import Express from 'express';
import * as Controller from './controller';
import { Authorization, CheckRole } from '../../middlewares';
import { Identify } from '../../constants';

export const authRoutes = Express.Router();

authRoutes.route('/sign-up').post(Controller.signUpAccount);
authRoutes.route('/verify-otp').post(Controller.verifyOtp);
authRoutes.route('/resend-otp/reset-password').post(Controller.resendOtpForConfirmResetPass);
authRoutes.route('/resend-otp/confirm-email').post(Controller.resendOtpForConfirmEmail);
authRoutes.route('/sign-in').post(Controller.signIn);
authRoutes.route('/forgot-password').post(Controller.forgotPassword);
authRoutes.route('/reset-password').put(Controller.resetPassword);
authRoutes
    .route('/change-password')
    .put(
        Authorization,
        CheckRole([Identify.Admin, Identify.Manager, Identify.Assistant, Identify.Employee]),
        Controller.changePassword,
    );
authRoutes.route('/get-access-token').post(Controller.getNewAccessToken);
