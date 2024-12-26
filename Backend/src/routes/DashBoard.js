import express from "express";
import asynchandler from "../utils/asynchandler.js"
import verifyToken from "../middlewares/Verify.middleware.js";
import { dashboard,sharedashboard,shareddashboardID,sharelink,dashboardlink} from "../controllers/DashBoard.controller.js";


const router = express.Router();

router.post('/createdashboard', verifyToken, asynchandler(dashboard))
router.post('/sharedashboard', verifyToken, asynchandler(sharedashboard))
router.get('/shareddashboardID' , verifyToken , asynchandler(shareddashboardID))
router.post('/share-link', verifyToken, asynchandler(sharelink))
router.post('/shared-dashboard', verifyToken, asynchandler(dashboardlink))


export default router