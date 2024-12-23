import express from "express";
import asynchandler from "../utils/asynchandler.js"
import verifyToken from "../middlewares/Verify.middleware.js";
import {updateuserdetails} from "../controllers/Update.controller.js"

const router = express.Router();

router.post('/updateuserdetails', verifyToken, asynchandler(updateuserdetails))


export default router