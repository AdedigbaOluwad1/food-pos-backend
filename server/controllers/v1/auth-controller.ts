import { Response, Request } from "express"
import bcrypt from "bcrypt";
import { User, RefreshTokens } from "../../models/authModel";
import { sign, verify } from "jsonwebtoken";
const saltRounds = 12;

const controller = {
    login: async (req: Request, res: Response) => { 
        try {
            const email = req.body.email as string;
            const password = req.body.password as string;

            // checks if user exists
            const user = await User.findOne({email: email})

            if (!user) return res.status(400).json({message: 'No account found with matching details'})

            // compares found user password with submitted password
            const comparePassword = await bcrypt.compare(password, user.password)

            if (!comparePassword) return res.status(400).json({ message: 'Wrong password' })

            // if user exists and password is correct, return user object
            const authenticatedUser = { 
                firstName: user.firstName,
                lastName: user.lastName,
                userID: user._id,
                signedInAt: new Date()
            }

            // creates authorization token and refresh token
            const authorizationToken = sign(authenticatedUser, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '2 days'})
            const refreshToken = sign(authenticatedUser, process.env.REFRESH_TOKEN_SECRET!)

            // stores both tokens in the database
            const saveRefreshToken = await RefreshTokens.create({
                authorizationToken: authorizationToken,
                refreshToken: refreshToken
            })
        
            // checks if token has been stored, then returns userObject and authorization token to the client
            if (saveRefreshToken){
                res.status(200).json({
                    message: 'Login successful!',
                    response: {
                        ...authenticatedUser,
                        authorizationToken
                    },
                })
            } else {
                // handles errors 
                res.status(400).json({ message: 'An error occurred' })
            }
        } catch (err) {
            res.status(500).json(err)
        }
    },

    signUp: async (req: Request, res: Response) => {
        try {
            // request body
            const firstName = req.body.firstName as string;
            const lastName = req.body.lastName as string;
            const email = req.body.email as string;
            const unHashedPassword = req.body.password as string;
            const confirmPassword = req.body.confirmPassword as string;

            // hashing the password with bcrypt
            const password = await bcrypt.hash(unHashedPassword, saltRounds)

            // checks the db for users with corresponding email
            const user = await User.findOne({ email: email})

            if (unHashedPassword !== confirmPassword) {
                res.status(500).json({ message: 'Password and confirm password do not match' })
            } else if (user) {
                res.status(500).json({ message: 'A user with that email exists'})
            } else {
                await User.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                }) 
                res.status(201).json({ message: 'Account created successfully!'})
            }
            
        } catch (err) {
            res.status(500).json(err)
        }
    },

    logout: async (req: Request, res: Response) => {
        try {
            const { authorizationToken } = (req as any).user
            // delete refresh token and authorization token for the user in session
            RefreshTokens.findOneAndDelete({ authorizationToken: authorizationToken })
            res.status(203).json({ message: 'Logged out successfully' })
        } catch (err) {
            res.status(500).json({ message: 'An error occurred', err})
        }
    },

    generateAccessToken: async (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.params
            if (!refreshToken) {
                res.status(400).json({ message: 'A refresh token is required'})
            } else {
                verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any, user: any) => {
                    if (err) {
                        res.status(403).json({ message: 'Invalid refresh token'})
                    } else {
                        const authenticatedUser = { 
                            firstName: user.firstName,
                            lastName: user.lastName,
                            signedInAt: new Date()
                        }
                        const newAccessToken = sign(authenticatedUser, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '60s'})
                        const newRefreshToken = sign(authenticatedUser, process.env.REFRESH_TOKEN_SECRET!)
                        res.status(201).json({ newRefreshToken: newRefreshToken, newAccessToken: newAccessToken })
                    }
                })
            }
        } catch (err) {
            res.status(401).json(err)
        }
    }
}

export default controller