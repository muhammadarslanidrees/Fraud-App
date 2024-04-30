import express from "express";
import "dotenv/config";

import apiRouter from "./routes/apiRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/hello", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.use("/api", apiRouter);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
