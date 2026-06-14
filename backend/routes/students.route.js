import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdminOrTeacher } from '../middlewares/isAdminOrTeachers.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { createStudent, deleteStudent, getAllStudents, getSingleStudent, getStudentsByClass, updateStudent } from '../controllers/students.controllers.js';


const router = express.Router();

router.get('/', verifyToken, getAllStudents);

router.get('/:id', verifyToken, getSingleStudent);

router.get("/class/:id", verifyToken, getStudentsByClass);


router.post('/', verifyToken, isAdminOrTeacher, createStudent);


router.put('/:id', verifyToken, isAdmin, updateStudent);

router.delete('/:id', verifyToken, isAdmin, deleteStudent);


export default router;