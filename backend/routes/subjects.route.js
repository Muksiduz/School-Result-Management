import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { createSubject, deleteSubject, getAllSubjects, getSubjectsByClass, updateSubject } from '../controllers/subjects.controllers.js';
import { isAdminOrTeacher } from '../middlewares/isAdminOrTeachers.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// GET all subjects
router.get("/", verifyToken, getAllSubjects);

// GET subjects by class
router.get("/class/:class_id", verifyToken, getSubjectsByClass); 

// POST create subject
router.post("/", verifyToken, isAdminOrTeacher, createSubject);

// PUT update subject (admin only)
router.put("/:id", verifyToken, isAdmin, updateSubject);

// DELETE subject (admin only)
router.delete("/:id", verifyToken, isAdmin, deleteSubject);


export default router;