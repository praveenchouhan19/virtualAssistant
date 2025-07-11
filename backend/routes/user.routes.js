import express from "express"
import { getCurrentUser, updateAssistant, askToAssistant } from "../controllers/user.controllers.js"
import isAuth from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"
import { use } from "react"

const userRouter = express.Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.post("/update",isAuth, upload.single("assistantImage"),updateAssistant) //new
userRouter.post("/asktoassistant",isAuth,askToAssistant)
export default userRouter