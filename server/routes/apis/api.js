import userRoute from '../users/userRoutes.js';

import express from 'express';
import { Router } from 'express';

const router = Router();

router.use('/users', userRoute);


export default router;