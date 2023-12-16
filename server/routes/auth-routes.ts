import express from 'express'
import controller from '../controllers/v1/auth-controller'

const router = express.Router()

router.post("/login", controller.login)
router.post("/signup", controller.signUp)
export default router

