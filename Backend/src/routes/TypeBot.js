import express from "express";
import verifyToken from "../middlewares/Verify.middleware.js"
import asynchandler from "../utils/asynchandler.js"
import {createtypebot} from "../controllers/TypeBot.controller.js"

const router = express.Router();

router.post('/createtypebot', verifyToken, asynchandler(createtypebot))


export default router