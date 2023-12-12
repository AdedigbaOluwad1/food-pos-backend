import express from 'express'
import controller from '../controllers/v1/login-controller'

const router = express.Router()

router.get("/", controller.get)

export default router

