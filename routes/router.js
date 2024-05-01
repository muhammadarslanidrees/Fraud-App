import { Router } from "express";

import AuthRouter from "./auth.routes.js";
import ProfileRouter from "./profile.routes.js";

const router = Router();

// Auth Routes
router.use("/auth", AuthRouter);

// Profile Routes
router.use("/profile", ProfileRouter);

export default router;
