import { Router } from "express";

import {
  registerUser,
  authUser,
  allUsers,
} from "../controllers/userControllers.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = Router();

router
  .route("/")
  .post(registerUser) // Handles POST /api/user
  .get(protect, allUsers); // Handles GET /api/user
router.post("/login", authUser); // Handles POST /api/user/login
// router.route("/").get(protect, allUsers);
export default router;
