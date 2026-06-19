import express from "express";
import pool from "../db/pool.js";

import { getClassResult, getResultOfSingleStudent, getStudentBySessionClassAndSection, getUnitTest, insertResult, insertResultOneSubjectAllStudents, oneStudentAllSubjects, oneSubjectAllStudents } from "../controllers/result.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdminOrTeacher } from "../middlewares/isAdminOrTeachers.js";

const router = express.Router();

// POST - bulk insert results for one student (all subjects at once)
router.post("/", verifyToken, isAdminOrTeacher, insertResult);

// GET - distinct students who have results in a session + class + section
router.get("/students", verifyToken, getStudentBySessionClassAndSection);

// GET - distinct unit tests for a student in a session
router.get("/unit-tests", verifyToken, getUnitTest);

// GET - full result for a student in a specific unit test
router.get("/full", verifyToken, getResultOfSingleStudent);

router.get("/class-result", verifyToken, getClassResult)

// // One student -> all the subject at once
// router.post('/student', verifyToken, isAdminOrTeacher, oneStudentAllSubjects);

// // One subject -> all the student's marks at once
// router.post('/subject', verifyToken, isAdminOrTeacher, oneSubjectAllStudents);


// POST - bulk insert/update marks for all students for one subject
router.post(
  "/enter",
  verifyToken,
  isAdminOrTeacher,
  insertResultOneSubjectAllStudents,
);




export default router;
