import { Router } from "express";

import { NewsController } from "../controller/news.controller.js";
import { JwtMiddleware } from "../middleware/jwt.middleware.js";

const router = Router();

router.get("/get", NewsController.getNews);
router.post("/create", JwtMiddleware, NewsController.create);

export default router;
