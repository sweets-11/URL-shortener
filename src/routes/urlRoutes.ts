import { Router } from "express";
import {
  shortenUrl,
  redirectUrl,
  getUrlStats,
  deleteUrl,
} from "../controllers/urlController.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = Router();

router.post("/shorten", isAuthenticated, shortenUrl);
router.get("/:shortCode", redirectUrl);
router.get("/user/getUrlStats", isAuthenticated, getUrlStats);
router.delete("/:shortCode", isAuthenticated, deleteUrl);

export default router;
