import express from "express";
import handleGoogleAuth from "../controllers/api-google-auth-controller.js";
// import { verifyGoogleSingIn } from '../middlewares/index.js'; // якщо треба

const router = express.Router();

router.post(
  "/api/auth/google/callback",
  // verifyGoogleSingIn.userAuth, // можеш розкоментувати, коли потрібно
  handleGoogleAuth
);

export default router;
