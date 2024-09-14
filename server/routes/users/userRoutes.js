import * as userController from '../../controllers/userController.js';

import express from 'express';
import { Router } from 'express';
import { verifyUser } from "../../middlewares/verifyUser.js";

const router = Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.login);
router.get('/getUser', verifyUser,userController.getUser);
router.put('/updateUser',verifyUser ,userController.updateUser);
router.delete('/deleteUser',verifyUser ,userController.deleteUser);

export default router;