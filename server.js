import express from "express";
import "dotenv/config";

const app = express();

app.get("/hello", (req, res) => {
  res.json({ message: "Hello World!" });
});

const PORT = process.env.PORT || 6000;

console.log("Database URL is ", process.env.DATABASE_URL);

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
