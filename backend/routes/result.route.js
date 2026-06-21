import express from "express";
import pool from "../db/pool.js";

import { getClassResult, getResultOfSingleStudent, getStudentBySessionClassAndSection, getUnitTest, insertResult, insertResultOneSubjectAllStudents, oneStudentAllSubjects, oneSubjectAllStudents } from "../controllers/result.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdminOrTeacher } from "../middlewares/isAdminOrTeachers.js";
import { isAdmin } from "../middlewares/isAdmin.js";

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

// PATCH - update single student mark
router.patch("/update-mark", verifyToken, isAdmin, async (req, res) => {
  const { student_id, unit_test_id, subject_id, marks_obtained } = req.body;
  try {
    const result = await pool.query(
      `UPDATE results SET marks_obtained=$1
       WHERE student_id=$2 AND unit_test_id=$3 AND subject_id=$4
       RETURNING *`,
      [marks_obtained, student_id, unit_test_id, subject_id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Result not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




export default router;
