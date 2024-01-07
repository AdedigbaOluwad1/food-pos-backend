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

const refreshTokensSchema = new mongoose.Schema(
    {
        authorizationToken: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        }
    },
)

const User = mongoose.model('User', userSchema)

const RefreshTokens = mongoose.model('RefreshTokens', refreshTokensSchema)

export {
    User,
    RefreshTokens
}