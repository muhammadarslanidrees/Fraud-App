import { Router } from "express";

import { authController } from "../controller/authController.js";

const router = Router();

router.post("/register", authController.register);

export default router;
