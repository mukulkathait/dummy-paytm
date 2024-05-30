import express from 'express'
import { router } from "./routes/index.route.js";
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./db.js"

dotenv.config();

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Listening on http://localhost:${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log("MONGODB CONNECTION FAILED: ", error)
    })

const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/v1", router)