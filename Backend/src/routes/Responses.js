import express from "express";
import asynchandler from "../utils/asynchandler.js"
import {incrementViewCount,incrementStartCount,addFormResponse} from "../controllers/Responses.controller.js"

const router = express.Router();

router.post('/add-form-response',asynchandler(addFormResponse))
router.patch('/increment-view-count/:formId',asynchandler(incrementViewCount))
router.patch('/increment-start-count/:formId',asynchandler(incrementStartCount))

export default router