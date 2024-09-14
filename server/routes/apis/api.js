import userRoute from '../users/userRoutes.js';
import projectRoute from '../projects/projectsRoutes.js';

import { Router } from 'express';

const router = Router();

router.use('/users', userRoute);
router.use('/projects', projectRoute);


export default router;