import express from "express";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import chalk from "chalk";
import morgan from "morgan";
import apiGoogleRoutes from "./routes/api-google-routes.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

const errorMsg = chalk.bgKeyword("white").redBright;
const successMsg = chalk.bgKeyword("green").white;

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: ["http://localhost:4202", "http://localhost:4201"],
};

connectDB(); // Connect to MongoDB

app.use(cors(corsOptions));

//MIDDLEWARE
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(express.static(path.join(__dirname, "dist/browser")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Parse JSON request body

//API
app.use(apiGoogleRoutes);
// app.use(apiAuthRoutes);
// app.use(apiChatRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Start the server
app.listen(PORT, (error) => {
  error
    ? console.log(errorMsg(error))
    : console.log(successMsg(`Server listens on https//localhost:${PORT}`));
});

// 👇 add a global error handler after all the routes.
app.use((err, req, res, next) => {
  err.statusCode = err?.statusCode || 500;
  err.code = err?.code || null;
  err.originalError = err?.originalError || "Internal Server Error";

  const errorResponse = {
    status: err.statusCode,
    code: err.code,
    message: err.message,
    originalError: err.originalError,
  };

  res.status(err.statusCode).json(errorResponse);
});

export default app;
