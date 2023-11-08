import Express from 'express';
import { authRoutes } from './auth';
import { roleRoutes } from './role';
import { debugRoutes } from './debug';
import { employeeRoutes } from './employee';
import { clientRoutes } from './client';
import { typeItemRoutes } from './type_item';

export const apiControllers = Express.Router();

apiControllers.use('/auth', authRoutes);
apiControllers.use('/role', roleRoutes);
apiControllers.use('/debug', debugRoutes);
apiControllers.use('/employee', employeeRoutes);
apiControllers.use('/client', clientRoutes);
apiControllers.use('/type-item', typeItemRoutes);
