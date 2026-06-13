import express from "express";

import pool from "../db/pool.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  createSection,
  deleteSection,
  getAllSections,
  getSectionsByClass,
  updateSection,
} from "../controllers/section.controllers.js";
import { isAdminOrTeacher } from "../middlewares/isAdminOrTeachers.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

// GET all sections
router.get("/", verifyToken, getAllSections);

// GET sections by class
router.get("/class/:class_id", verifyToken, getSectionsByClass);

// POST create section
router.post("/", verifyToken, isAdminOrTeacher, createSection);

// PUT update section (admin only)
router.put("/:id", verifyToken, isAdmin, updateSection);

// DELETE section (admin only)
router.delete("/:id", verifyToken, isAdmin, deleteSection);

export default router;
