import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerUser as any);
router.post("/login", isAuthenticated, loginUser as any);
router.get("/logout", isAuthenticated, logoutUser);

export default router;
