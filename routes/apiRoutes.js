import { Router } from "express";

import authRouter from "./authRoutes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/data", authRouter);

export default router;
