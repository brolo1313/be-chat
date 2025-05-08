import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { successMsg } from "./utils/logger.js";

import connectDB from "./utils/db.js";
import apiGoogleRoutes from "./routes/api-google-routes.js";
import apiChatRoutes from "./routes/api-chat-routes.js";
import apiMessageRoutes from "./routes/api-message-routes.js";
import initSocketIO from "./sockets/initSocket.js";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

const server = http.createServer(app);
initSocketIO(server);

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "*",
};

connectDB();

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
app.use(apiChatRoutes);
app.use(apiMessageRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

server.listen(PORT, () =>
  console.log(successMsg(`Server running on http://localhost:${PORT}`))
);

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
