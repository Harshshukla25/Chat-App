import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { chatWithAI, getMessages, sendMessage } from "../controllers/message.contoller.js"

const messageRouter=express.Router()


messageRouter.post("/send/:receiver",isAuth,upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),sendMessage)
messageRouter.get("/get/:receiver",isAuth,getMessages)
messageRouter.post("/chat-ai", isAuth, chatWithAI);

export default messageRouter;