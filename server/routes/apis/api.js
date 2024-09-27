import userRoute from '../users/userRoutes.js';
import projectRoute from '../projects/projectsRoutes.js';
import APIRoutes from '../apisRoutes/apiRoutes.js';

import { Router } from 'express';

const router = Router();

router.use('/users', userRoute);
router.use('/projects', projectRoute);
router.use('/apis', APIRoutes);


export default router;