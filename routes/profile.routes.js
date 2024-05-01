import { Router } from "express";

import { JwtMiddleware } from "../middleware/jwt.middleware.js";
import { ProfileController } from "../controller/profile.controller.js";

const router = Router();

router.get("/get", JwtMiddleware, ProfileController.getUser);
router.put("/update/:id", JwtMiddleware, ProfileController.updateUser);

export default router;
