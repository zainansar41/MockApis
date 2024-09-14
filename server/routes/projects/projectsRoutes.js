import { verifyUser } from "../../middlewares/verifyUser.js";
import * as projectController from "../../controllers/projectController.js";
import { Router } from "express";

const router = Router();

router.post("/createProject", verifyUser, projectController.createProject);
router.get("/getProjects", verifyUser, projectController.getProjects);
router.get("/getProject/:id", verifyUser, projectController.getProject);
router.put("/updateProject/:id", verifyUser, projectController.updateProject);
router.delete("/deleteProject/:id", verifyUser, projectController.deleteProject);

export default router;
