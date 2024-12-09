import { Router } from "express";

const router = Router();

router.get("/screennew4/close", (req, res) => {
  res.status(200).json({ message: "success" });
});

router.get("/screennew4/memo", (req, res) => {
  res.status(200).json({ message: "success" });
});

router.post("/screen4", (req, res) => {
  console.log("\n\ncustAccSummary:::res body is : ", req.body);

  res.status(201).json({ message: "success" });
});

router.get("/screen5/actionstatus", (req, res) => {
  res.status(200).json({ message: "success" });
});

router.get("/screen5/all/actionstatus", (req, res) => {
  res.status(200).json({ message: "success" });
});

export default router;
