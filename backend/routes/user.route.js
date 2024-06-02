import express from "express"
import { z } from "zod"
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";
import { Account } from "../models/account.model.js"

const signupBody = z.object({
    firstName: z.string().max(50),
    lastName: z.string().max(50),
    username: z.string().min(3),
    password: z.string().min(8)
})

const signinBody = z.object({
    username: z.string(),
    password: z.string()
})

const updateBody = z.object({
    firstName: z.string().max(50).optional(),
    lastName: z.string().max(50).optional(),
    password: z.string().min(8).optional()
})

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { success } = signupBody.safeParse(req.body)
        if (!success) {
            return res.status(411).json({
                success: false,
                message: "Incorrect Inputs"
            })
        }

        const existingUser = await User.findOne({
            username: req.body.username
        })

        if (existingUser) {
            return res.status(411).json({
                success: false,
                message: "Email already taken"
            })
        }

        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        })
        const userId = user._id;

        const token = jwt.sign({
            userId
        }, process.env.JWT_SECRET)

        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        })

        const userData = await User.findOne({
            _id: userId
        })
        console.log("UserData generated after SIGNUP: ", userData)

        if (userData) {
            res.json({
                success: true,
                message: "User created successfully",
                token: token,
                userData
            })
        }
    } catch (error) {
        console.log("Error during user signup: ", error)
    }
})

router.post("/signin", async (req, res) => {
    try {
        const { success } = signinBody.safeParse(req.body)
        if (!success) {
            res.status(411).json({
                success: false,
                message: "Invalid Inputs"
            })
        }

        const user = await User.findOne({
            username: req.body.username,
            password: req.body.password
        })

        if (user) {
            const token = jwt.sign({
                userId: user._id
            }, process.env.JWT_SECRET)

            res.status(200).json({
                success: true,
                message: "User logged-in successfully",
                token: token,
                userData: user,
            })
            return;
        }
        res.status(411).json({
            success: false,
            message: "Error while loggin in"
        })
    } catch (error) {
        console.log("Error during user signin: ", error)
    }
})

router.put("/", authMiddleware, async (req, res) => {
    try {
        const { success } = updateBody.safeParse(req.body)

        if (!success) {
            res.status(411).json({
                success: false,
                message: "Invalid Inputs"
            })
        }

        await User.updateOne({ _id: req.userId }, req.body);

        res.status(200).json({
            success: true,
            message: "Updated Successfully"
        })

    } catch (error) {
        console.log("Error during user updation: ", error)
    }
})

router.get("/bulk", authMiddleware, async (req, res) => {
    try {
        const filter = req.query.filter || "";

        const users = await User.find({
            $or: [{
                'firstName': {
                    "$regex": filter,
                    "$options": "i"
                }
            }, {
                'lastName': {
                    "$regex": filter,
                    "$options": "i"
                }
            }],
        })

        res.status(200).json({
            success: true,
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        })
    } catch (error) {
        console.log("Error while users extraction: ", error)
    }
})

export default router;