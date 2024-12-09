import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";

import apiRouter from "./routes/router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

// app.use("/api", apiRouter);

app.use("/api", apiRouter);

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
