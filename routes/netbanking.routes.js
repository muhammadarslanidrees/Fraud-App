import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  console.log("\n\nnetbanking:::res body is : ", req.body);
  res.status(200).json({ message: "success" });
});

router.post("/top_fraud_transaction", (req, res) => {
  console.log("\n\nnetbanking:::res body is : ", req.body);
  res.status(201).json({ message: "success" });
});

router.get("/token/usecurepro", (req, res) => {
  res.status(200).json({ message: "success" });
});

export default router;
