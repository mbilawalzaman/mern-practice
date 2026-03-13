import express from "express";
const router = express.Router();

import {
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../../controllers/authController/authController.js";


router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshAccessToken);

export default router;
