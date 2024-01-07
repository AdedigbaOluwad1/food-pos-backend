import express from 'express'
import controller from '../controllers/v1/auth-controller'
import authMiddleWare from '../controllers/v1/authorization-middleware'

const router = express.Router()

router.post("/login", controller.login)
router.post("/signup", controller.signUp)
router.get("/:refreshToken", controller.generateAccessToken)
router.delete('/logout', authMiddleWare, controller.logout)
export default router

