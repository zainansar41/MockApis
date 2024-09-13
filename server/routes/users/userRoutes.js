import * as userController from '../../controllers/userController.js';

import express from 'express';
import { Router } from 'express';

const router = Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.login);
router.get('/getUser', userController.getProfile);
router.put('/updateUser', userController.updateProfile);
router.delete('/deleteUser', userController.deleteProfile);

export default router;