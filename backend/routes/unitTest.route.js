import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdminOrTeacher } from '../middlewares/isAdminOrTeachers.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { createUnitTest, deleteUnitTest, getAllUnitTest, getUnitTestBySession, updateUnitTest } from '../controllers/unitTest.controllers.js';


const router = express.Router();

router.get('/',verifyToken,getAllUnitTest);

router.get('/session/:id', verifyToken, getUnitTestBySession);


router.post('/', verifyToken, isAdminOrTeacher, createUnitTest);

router.put('/:id', verifyToken, isAdmin, updateUnitTest);

router.delete('/:id', verifyToken, isAdmin, deleteUnitTest);



export default router;