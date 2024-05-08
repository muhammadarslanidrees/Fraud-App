import { Router } from "express";

import AuthRouter from "./auth.routes.js";
import ProfileRouter from "./profile.routes.js";
import NewsRouter from "./news.routes.js";

const router = Router();

// Auth Routes
router.use("/auth", AuthRouter);

// Profile Routes
router.use("/profile", ProfileRouter);

// News Routes
router.use("/news", NewsRouter);

export default router;
