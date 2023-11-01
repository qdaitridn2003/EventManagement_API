import Express from 'express';
import { authRoutes } from './auth';
import { roleRoutes } from './role';
import { debugRoutes } from './debug';
import { employeeRoutes } from './employee';

export const apiControllers = Express.Router();

apiControllers.use('/auth', authRoutes);
apiControllers.use('/role', roleRoutes);
apiControllers.use('/debug', debugRoutes);
apiControllers.use('/employee', employeeRoutes);
