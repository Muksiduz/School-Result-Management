import express from 'express';
import { verifyToken} from '../middlewares/verifyToken.js';
import {
  createOldSession,
  getAllOldSessions,
  
  getSingleOldSessions,
  updateOldSession,
  deleteOldSession,
} from "../controllers/old.sessions.controllers.js";
import { isAdminOrTeacher } from '../middlewares/isAdminOrTeachers.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();


// to get all the old sessions
router.get("/", verifyToken, getAllOldSessions);

// to get a single old session
router.get("/:id", verifyToken, getSingleOldSessions);

// to create a old session
router.post("/", verifyToken, isAdminOrTeacher, createOldSession);

// to update a old session
router.put("/:id", verifyToken, isAdmin, updateOldSession);

// to delete a old session
router.delete("/:id", verifyToken, isAdmin, deleteOldSession);


export default router;