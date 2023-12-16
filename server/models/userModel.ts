import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Please enter an email"]
        },
        lastName: {
            type: String,
            required: [true, "Please enter an email"]
        },
        email: {
            type: String,
            required: [true, "Please enter an email"]
        },
        password: {
            type: String,
            required: [true, 'Please enter a password']
        },
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema)

export default User