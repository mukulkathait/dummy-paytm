import express from "express"
import authMiddleware from "../middleware/authMiddleware.js";
import { Account } from "../models/account.model.js";
import { z } from "zod"
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const transferBalBody = z.object({
    to: z.string(),
    amount: z.number()
})

const router = express.Router();

router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({
            userId: req.userId
        })

        res.status(200).json({
            success: true,
            balance: account.balance
        })
    } catch (error) {
        console.log("Error during balance extraction: ", error)
    }
})

router.post('/transfer', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { success } = transferBalBody.safeParse(req.body)
        if (!success) {
            res.status(411).json({
                success: false,
                message: "Invalid Inputs"
            })
        }

        const senderAccountInfo = await User.find({
            userId: req.userId
        })

        if (senderAccountInfo.balance < req.body.amount) {
            await session.abortTransaction();
            res.status(400).json({
                success: false,
                message: "Insufficient balance"
            })
        }

        const receiverAccountInfo = await User.find({
            userId: req.body.to
        })

        if (!receiverAccountInfo) {
            await session.abortTransaction();
            res.status(400).json({
                success: false,
                message: "Invalid Account"
            })
        }

        //Approach 1 for balance updation
        /* senderAccountInfo.balance -= req.body.amount;
        receiverAccountInfo.balance += req.body.amount;

        await senderAccountInfo.save({ session })
        await receiverAccountInfo.save({ session }) */

        //Approach 2 for balance updation
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -req.body.amount } }).session(session);
        await Account.updateOne({ userId: req.to }, { $inc: { balance: req.body.amount } }).session(session);

        await session.commitTransaction();
        session.endSession()

        res.status(200).json({
            success: true,
            message: "Transfered Successfully"
        })

    } catch (error) {
        await session.abortTransaction();
        session.endSession()
        console.log("Error during balance transfer: ", error)
    }
})

export default router




















