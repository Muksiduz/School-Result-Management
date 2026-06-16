import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getDashboardData } from "../controllers/dashboard.controllers.js";

const router = express.Router();

router.get("/", verifyToken, getDashboardData);

export default router;
