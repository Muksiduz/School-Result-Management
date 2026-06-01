import express from 'express'

import { verifyToken } from '../middlewares/verifyToken';
import { isAdmin } from '../middlewares/isAdmin';
import { createUserController } from '../controllers/user.controllers';

const router = express.Router();

