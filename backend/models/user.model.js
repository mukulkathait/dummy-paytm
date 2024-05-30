import mongoose, { Schema } from "mongoose"

const userSchema = Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            minLength: 3,
            maxLength: 30
        },
        firstName: {
            type: String,
            trim: true,
            maxLength: 50
        },
        lastName: {
            type: String,
            trim: true,
            maxLength: 50
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minLength: 8
        }
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", userSchema);
