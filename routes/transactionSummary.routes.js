import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  console.log("\n\ntransaction:::res body is : ", req.body);
  res.status(200).json({ message: "success" });
});

router.post("/suspect_transaction_summary", (req, res) => {
  console.log("\n\ntransaction:::res body is : ", req.body);
  res.status(200).json({ message: "success" });
});

export default router;