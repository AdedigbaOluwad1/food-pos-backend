import express from "express";
import cartController from "../controllers/v1/cart-controller";
import authMiddleWare from "../controllers/v1/authorization-middleware";

const cartRoutes = express.Router()
cartRoutes.post('/add-to-cart', authMiddleWare, cartController.addToCart)
cartRoutes.get('/get-cart-items', authMiddleWare, cartController.getCartItems)
cartRoutes.delete('/remove-from-cart', authMiddleWare, cartController.removeFromCart)
cartRoutes.post('/checkout', authMiddleWare, cartController.checkoutCartItems)

export default cartRoutes