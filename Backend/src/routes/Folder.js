import express from "express";
import asynchandler from "../utils/asynchandler.js"
import verifyToken from "../middlewares/Verify.middleware.js";
import {createfolder,getfolders,deletefolder} from "../controllers/Folder.controller.js"

const router = express.Router();

router.post('/createfolder', verifyToken, asynchandler(createfolder))
router.get('/getfolders',verifyToken,asynchandler(getfolders))
router.delete('/deletefolder/:folderId', verifyToken, asynchandler(deletefolder))


export default router