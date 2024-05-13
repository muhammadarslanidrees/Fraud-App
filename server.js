import express from "express";
import "dotenv/config";
import fileUpload from "express-fileupload";
import cors from "cors";
import helmet from "helmet";

import apiRouter from "./routes/router.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

app.use("/api", apiRouter);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
