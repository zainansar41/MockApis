import express from 'express';
import { Router } from 'express';
import { verifyUser } from "../../middlewares/verifyUser.js";
import * as APIController from "../../controllers/apiController.js";

const router = Router();

router.post("/createAPI", verifyUser, APIController.createApi);
router.get("/getAPIs", verifyUser, APIController.getApis);
router.all("/:projectName/*", verifyUser, APIController.getMockApiResponse);

export default router;