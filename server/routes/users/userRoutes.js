import * as userController from '../../controllers/userController.js';

import express from 'express';
import { Router } from 'express';

const router = Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.login);
router.get('/getUser', userController.getUser);
router.put('/updateUser', userController.updateUser);
router.delete('/deleteUser', userController.deleteUser);

export default router;