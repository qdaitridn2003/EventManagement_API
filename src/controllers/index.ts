import Express from 'express';
import { authRoutes } from './auth';
import { roleRoutes } from './role';
import { debugRoutes } from './debug';
import { employeeRoutes } from './employee';
import { clientRoutes } from './client';
import { categoryRoutes } from './category';
import { itemRoutes } from './item';
import { serviceRoutes } from './service';
import { timelineRoutes } from './timeline';
import { contractRoutes } from './contract';
import { transportRoutes } from './transport';
import { paymentRoutes } from './payment';
export const apiControllers = Express.Router();

apiControllers.use('/auth', authRoutes);
apiControllers.use('/role', roleRoutes);
apiControllers.use('/debug', debugRoutes);
apiControllers.use('/employee', employeeRoutes);
apiControllers.use('/client', clientRoutes);
apiControllers.use('/category', categoryRoutes);
apiControllers.use('/item', itemRoutes);
apiControllers.use('/service', serviceRoutes);
apiControllers.use('/timeline', timelineRoutes);
apiControllers.use('/contract', contractRoutes);
apiControllers.use('/transport', transportRoutes);
apiControllers.use('/payment', paymentRoutes);
