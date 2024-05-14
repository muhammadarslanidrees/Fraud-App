import { Router } from "express";

import { NewsController } from "../controller/news.controller.js";
import { JwtMiddleware } from "../middleware/jwt.middleware.js";
import redisCache from '../DB/redis.config.js'

const router = Router();

router.get("/", redisCache.route(), NewsController.getNews);
router.post("/", JwtMiddleware, NewsController.createNews);
router.get("/:id", JwtMiddleware, NewsController.getNewsById);
router.put("/:id", JwtMiddleware, NewsController.updateNews);
router.delete("/:id", JwtMiddleware, NewsController.deleteNews);

export default router;
