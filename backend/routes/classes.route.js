import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { createClass, deleteClass, getAllClasses, updateClass } from '../controllers/classes.controllers.js';
import { isAdminOrTeacher } from '../middlewares/isAdminOrTeachers.js';
import { isAdmin } from '../middlewares/isAdmin.js';
const router = express.Router();

router.get('/', verifyToken, getAllClasses);
router.post('/', verifyToken, isAdminOrTeacher, createClass);
router.put('/:id', verifyToken, isAdmin, updateClass);
router.delete('/:id', verifyToken, isAdmin, deleteClass);



export default router;