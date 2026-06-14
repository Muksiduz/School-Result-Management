import express from "express";
import pool from "../db/pool.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdminOrTeacher } from "../middlewares/isAdminOrTeachers.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {createSession, deleteSession, getAllSessions, getSingleSession, updateSession} from '../controllers/session.controllers.js'

const router = express.Router();

// GET all sessions
router.get("/", verifyToken, getAllSessions);

// GET single session
router.get("/:id", verifyToken, getSingleSession);

// POST create session
router.post("/", verifyToken, isAdminOrTeacher, createSession);

// PUT update session (admin only)
router.put("/:id", verifyToken, isAdmin, updateSession);

// DELETE session (admin only)
router.delete("/:id", verifyToken, isAdmin, deleteSession);

export default router;
