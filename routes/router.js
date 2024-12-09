import { Router } from "express";

import netbankingRouter from "./netbanking.routes.js";
import accountSummaryRouter from "./accountSummary.routes.js";
import transactionSummaryRouter from "./transactionSummary.routes.js";
import searchEngineForReports from "./searchEngineForReports.routes.js";

const router = Router();

router.use("/users", netbankingRouter);
router.use("/screen2", transactionSummaryRouter);
router.use("/screen3", searchEngineForReports);
router.use("/", accountSummaryRouter);

export default router;
