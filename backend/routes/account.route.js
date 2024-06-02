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
        const parsedData = transferBalBody.safeParse(req.body)
        if (!parsedData.success) {
            await session.abortTransaction()
            session.endSession();
            res.status(411).json({
                success: false,
                message: "Invalid Inputs"
            })
        }

        const { to, amount } = parsedData.data;

        const presender = await Account.findOne({ userId: req.userId })
        const prereceiver = await Account.findOne({ userId: to })
        console.log("Previous Sender Balance: ", presender.balance)
        console.log("Previous Receiver Balance: ", prereceiver.balance)

        const senderAccountInfo = await Account.findOne({
            userId: req.userId
        }).session(session)

        if (!senderAccountInfo || senderAccountInfo.balance < amount) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({
                success: false,
                message: "Insufficient balance"
            })
        }

        const receiverAccountInfo = await Account.findOne({
            userId: to
        }).session(session)

        if (!receiverAccountInfo) {
            await session.abortTransaction();
            session.endSession()
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
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        session.endSession()

        res.status(200).json({
            success: true,
            message: "Transfered Successfully"
        })

        const sender = await Account.findOne({ userId: req.userId })
        const receiver = await Account.findOne({ userId: to })
        console.log("Updated Sender Balance: ", sender.balance)
        console.log("Updated Receiver Balance: ", receiver.balance)

    } catch (error) {
        await session.abortTransaction();
        session.endSession()
        console.log("Error during balance transfer: ", error)
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
})

export default router




















