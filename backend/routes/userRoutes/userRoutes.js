import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
const router = express.Router();

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/userController/userController.js";

// POST /api/users (public)
router.post("/", createUser);

router.use(protect);

// GET /api/users (protected)
router.get("/", getUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
