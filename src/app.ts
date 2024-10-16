import express from "express";
import mongoose from "mongoose";
import urlRoutes from "./routes/urlRoutes.js";
import { config } from "dotenv";
import userRoutes from "./routes/userRoutes.js";
config({
  path: "./.env",
});
const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(`${process.env.MONGO_URI}/urlShortenerTS`);

app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/urls", urlRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
