import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdminOrTeacher } from '../middlewares/isAdminOrTeachers.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { createStudent, deleteStudent, getAllStudents, getSingleStudent, getStudentsByClass, getStudentsByClassAndSection, promoteStudent, updateStudent } from '../controllers/students.controllers.js';


const router = express.Router();

router.get('/', verifyToken, getAllStudents);

router.get('/:id', verifyToken, getSingleStudent);

router.get("/class/:id", verifyToken, getStudentsByClass);

router.get(
  "/class/:class_id/section/:section_id",
  verifyToken,
  getStudentsByClassAndSection
);


router.post('/', verifyToken, isAdminOrTeacher, createStudent);


router.put('/:id', verifyToken, isAdmin, updateStudent);

router.delete('/:id', verifyToken, isAdmin, deleteStudent);

router.patch('/:student_id/promote', verifyToken, isAdmin, promoteStudent);

export default router;