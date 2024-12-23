import express from "express";
import verifyToken from "../middlewares/Verify.middleware.js"
import asynchandler from "../utils/asynchandler.js"
import {createtypebot,getTypeBot,deleteTypeBot} from "../controllers/TypeBot.controller.js"

const router = express.Router();

router.post('/createtypebot', verifyToken, asynchandler(createtypebot))
router.get('/getTypeBot', verifyToken, asynchandler(getTypeBot))
router.delete('/deleteTypeBot', verifyToken, asynchandler(deleteTypeBot))


export default router