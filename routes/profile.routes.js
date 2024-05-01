import { Router } from "express";

import { JwtMiddleware } from "../middleware/jwt.middleware.js";
import { ProfileController } from "../controller/profile.controller.js";

const router = Router();

router.get("/user", JwtMiddleware, ProfileController.getUser);

export default router;
