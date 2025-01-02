import express from "express";
import asynchandler from "../utils/asynchandler.js"
import {incrementViews,incrementStarts,saveSubmission,getviews,getstarts,getsubmissions} from "../controllers/Response.controller.js"

const router = express.Router();

router.put('/increment-view-count/:formId',asynchandler(incrementViews))
router.put('/increment-start-count/:formId',asynchandler(incrementStarts))
router.post('/add-form-response/:formId',asynchandler(saveSubmission))
router.get('/get-views/:formId',asynchandler(getviews))
router.get('/get-starts/:formId',asynchandler(getstarts))
router.get('/get-submissions/:formId',asynchandler(getsubmissions))


export default router