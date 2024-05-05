import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxLength: 50
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxLength: 50
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minLength: 5,
            maxLength: 30
        },
        password: {
            type: String,
            required: true,
            minLength: 8
        }
    }
)

export const User = mongoose.model("User", userSchema)