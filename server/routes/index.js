import { Router } from "express";

import apis from "./apis/api.js";

const router = Router();

router.get("/", (req, res) => {
    res.send("API is running");
    }
);

router.use("/api", apis);


export default router;
