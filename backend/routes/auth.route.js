import express from "express";

import {
  createUserController,
  deleteUserController,
  getAllUserController,
  loginController,
  updateUserController,
} from "../controllers/auth.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/login", loginController);

router.post("/create-user", verifyToken, isAdmin, createUserController);

router.get("/get-all-user", verifyToken, isAdmin, getAllUserController);

router.put("/update-user/:id", verifyToken, isAdmin, updateUserController);

router.delete("/delete-user/:id", verifyToken, isAdmin, deleteUserController);

export default router;
