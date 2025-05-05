import express from "express";
import handleGoogleAuth from "../controllers/api-google-auth.controller.js";

const router = express.Router();

router.post("/api/auth/google/callback", handleGoogleAuth);

export default router;
