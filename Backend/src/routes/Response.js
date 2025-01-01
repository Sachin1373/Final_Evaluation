import express from "express";
import asynchandler from "../utils/asynchandler.js"
import {incrementViews,incrementStarts,saveSubmission} from "../controllers/Response.controller.js"

const router = express.Router();

router.put('/increment-view-count/:formId',asynchandler(incrementViews))
router.put('/increment-start-count/:formId',asynchandler(incrementStarts))
router.post('/add-form-response',asynchandler(saveSubmission))

export default router