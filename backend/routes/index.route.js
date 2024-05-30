import { Router } from "express";
import userRouter from "./user.route.js"
import accountRouter from "./account.route.js"

const router = Router();

router.use("/user", userRouter)
router.use("/account", accountRouter)

export { router }