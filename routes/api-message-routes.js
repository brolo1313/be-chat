import express from "express";
import verifyByBearerToken from "../middleware/bearer-token.js";
import {
  deleteMessage,
  updateMessage,
} from "../controllers/api-message.controller.js";
const router = express.Router();

router.delete("/api/message/delete/:id", verifyByBearerToken, deleteMessage);
router.put("/api/message/update/:id", verifyByBearerToken, updateMessage);

export default router;
