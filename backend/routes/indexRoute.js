import { Router } from "express"
import * as userRouter from "./userRoute";

const router = Router()

router.use("/user", userRouter)

export default router;