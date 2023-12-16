import { Response, Request } from "express"
import bcrypt from "bcrypt";
import User from "../../models/userModel";
import { sign } from "jsonwebtoken";

const saltRounds = 12;

const controller = {
    login: async (req: Request, res: Response) => { 
        try {
            const email = req.body.email as string;
            const password = req.body.password as string;

            const user = await User.findOne({email: email})

            if (user){
                bcrypt.compare(password, user.password, (err, response) => {
                    if (!response) {
                        res.status(500).json('Incorrect password!')
                    } else {
                        const authenticatedUser = { 
                            firstName: user.firstName,
                            lastName: user.lastName
                        }
                        const authorizationToken = sign(authenticatedUser, process.env.ACCESS_TOKEN_SECRET!)
                        res.status(200).json({
                            message: 'Login successful!',
                            authenticatedUser,
                            authorizationToken: authorizationToken
                        })
                    }
                })
            } else {
                res.status(404).json('No account found with matching details')
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
                res.status(500).json('Password and confirm password do not match')
            } else if (user) {
                res.status(500).json('A user with that email exists')
            } else {
                await User.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                }) 
                res.status(201).json('Account created successfully!')
            }
            
        } catch (err) {
            res.status(500).json(err)
        }
        
    }
}

export default controller