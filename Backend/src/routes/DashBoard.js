import express from "express";
import asynchandler from "../utils/asynchandler.js"
import verifyToken from "../middlewares/Verify.middleware.js";
import { dashboard,sharedashboard,sharedashboarddetails,shareddashboardID } from "../controllers/DashBoard.controller.js";


const router = express.Router();

router.post('/createdashboard', verifyToken, asynchandler(dashboard))
router.post('/sharedashboard', verifyToken, asynchandler(sharedashboard))
router.get('/dashboarddetails', verifyToken , asynchandler(sharedashboarddetails))
router.get('/shareddashboardID' , verifyToken , asynchandler(shareddashboardID))


export default router