import express from "express";
import verifyByBearerToken from "../middleware/bearer-token.js";
import {
  createChat,
  updateChat,
  deleteChat,
  getChatById,
  getAllChat,
  getMessagesByChatId
} from "../controllers/api-chat.controller.js";

const router = express.Router();

router.post("/api/chat/create", verifyByBearerToken, createChat);
router.put("/api/chat/update/:id", verifyByBearerToken, updateChat);
router.delete("/api/chat/delete/:id", verifyByBearerToken, deleteChat);
router.get("/api/chat/get/:id", verifyByBearerToken, getChatById);
router.get("/api/chat/getAll", verifyByBearerToken, getAllChat);
router.get("/api/chat/getMessages/:id", verifyByBearerToken, getMessagesByChatId);

export default router;
