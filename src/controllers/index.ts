import Express from 'express';
import { authRoutes } from './auth';
import { roleRoutes } from './role';

export const apiControllers = Express.Router();

apiControllers.use('/auth', authRoutes);
apiControllers.use('/role', roleRoutes);
