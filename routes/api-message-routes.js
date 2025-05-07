import express from "express";
import verifyByBearerToken from "../middleware/bearer-token.js";
import { deleteMessage } from "../controllers/api-message.controller.js";
const router = express.Router();

router.delete("/api/message/delete/:id", verifyByBearerToken, deleteMessage);

export default router;