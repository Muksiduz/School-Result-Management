import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdminOrTeacher } from "../middlewares/isAdminOrTeachers.js";
import {
  createOldStudents,
  deleteOldStudents,
  getAllOldStudents,
  getOldStudentsBySession,
  getSingleOldStudents,
  updateOldStudents,
} from "../controllers/old.students.controller.js";

const router = express.Router();

// to get all the old students
router.get("/", verifyToken, getAllOldStudents);

router.get("/session/:id", verifyToken, getOldStudentsBySession);

router.get("/:id", verifyToken, getSingleOldStudents);

// to create a students
router.post("/", verifyToken, isAdminOrTeacher, createOldStudents);

//  to update a student
router.put("/:id", verifyToken, isAdminOrTeacher, updateOldStudents);

// to delete a student
router.delete("/:id", verifyToken, isAdminOrTeacher, deleteOldStudents);

export default router;
