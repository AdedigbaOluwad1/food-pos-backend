import { Request, Response } from 'express'
import { verify } from 'jsonwebtoken';

const authMiddleWare = async(req: any, res: Response, next: () => void) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);

        verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, user: any) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.user = user;
                next()
            } 
        })
    } catch(err){
        res.sendStatus(500);
    }
}

export default authMiddleWare;