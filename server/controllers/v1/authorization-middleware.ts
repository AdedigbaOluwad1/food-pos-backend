import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken';
import axios from 'axios';
import { RefreshTokens } from '../../models/authModel';

const authMiddleWare = async(req: any, res: Response, next: NextFunction) => {
    try {
        // get authorization from request headers
        const authHeader = req.headers['authorization'];

        // extract bearer token from authorization string
        const token = authHeader && authHeader.split(' ')[1];

        // check if bearer token exists and handle error if it doesn't
        if (token == null) return res.status(401).json({ message: 'Unathorized' });

        const isAccessTokenStored = await RefreshTokens.findOne({ authorizationToken: token})
        
        if (!isAccessTokenStored) return res.status(401).json({ message: 'Unathorized'})

        // verify if bearer token is valid
        const verifyToken = (token: string) => { 
            try {
               const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET!) 
               return decoded
            } catch (err) {
                return null;
            }
        }

        const verifiedPayload = verifyToken(token)

        if (verifiedPayload === null) {
            res.status(401).json({ message: 'Unathorized'})
            await RefreshTokens.findOneAndDelete({ authorizationToken: token })
        } else {
            req.user = verifiedPayload
            next()
        }

    } catch(err){
        // handle any errors in request execution
        res.sendStatus(500);
    }
}

export default authMiddleWare;