import { Request, Response } from "express";
import { IUser, ICart } from "../../../types/type";
import { Cart, Checkout } from "../../models/cartModel";
import Product from "../../models/productModel";
import ConstructCartItemObject from "../../helpers/cartItemConstructor";
const cartController = {
    addToCart: async (req: Request, res: Response) => {
        try {
            const { productID, quantity } = req.body
            const { userID }: IUser = (req as any).user

            // check if product exists
            const productExists = await Product.findById(productID)
            if (!productExists) return res.status(400).json({ message: 'Product does not exist' })

            // check if product already exists in user's cart
            const productExistsInUserCart = await Cart.findOne({ userId: userID, productId: productID, isCheckedOut: false })
            if (productExistsInUserCart) return res.status(400).json({ message: 'Item already exists in cart' })

            // add product to cart
            const newlyAddedProduct = await Cart.create({
                productId: productID,
                quantity: quantity,
                userId: userID
            })

            if (newlyAddedProduct) return res.status(201).json({ message: 'Item has been added to your cart successfully!', item: newlyAddedProduct })
        } catch (err) {
            res.status(500).json({ message: 'An error occurred', err})
        }
    },
    getCartItems: async (req: Request, res: Response) => {
        try {
            const { userID }: IUser = (req as any).user
            // get cart items with corresponding user id
            const cartItems = await Cart.find({ userId: userID, isCheckedOut: false }).lean().exec()

            // returns 204 if cart is empty
            if (!cartItems) return res.status(204).json({ message: 'Your cart is empty', cart: []})

            // constructs a new object for each cart item and pushes it to the cartItemsArray
            const cartItemsArray = await Promise.all(cartItems.map(async (e) => {
                const productDetail = await Product.findById(e.productId).lean().exec()

                return new ConstructCartItemObject(productDetail?.name as string, productDetail?.price as number, productDetail?.image as string, e.quantity, e.orderNote, e._id.toString())
            }))

            res.status(200).json({ message: 'Cart items retrieved successfully', cart: cartItemsArray})

        } catch (err) {
            res.status(500).json({ message: 'An error occurred', err})
        }
    },

    removeFromCart: async (req: Request, res: Response) => {
        try {
            const { order_id } = req.params;
            const { userID }: IUser = (req as any).user

            // check if product exists in cart
            const cartItemExists = await Cart.findOne({ userId: userID, id: order_id })

            if (!cartItemExists) return res.status(400).json({ message: 'Item does not exist in your cart'})
            
            const deleteItem = await Cart.findOneAndDelete({ userId: userID, id: order_id })
            
            if (deleteItem) return res.status(200).json({ message: 'Item has been removed from your cart' }) 

        } catch (err) {
            res.status(500).json({ message: 'An error occurred', err })
        }
    },

    checkoutCartItems: async (req: Request, res: Response) => {
        try {
            const { userID }: IUser = (req as any).user
            // get cart items with corresponding user id
            const cartItems = await Cart.find({ userId: userID, isCheckedOut: false }).lean().exec()

            // returns 204 if cart is empty
            if (cartItems.length < 1) return res.status(203).json({ message: 'Your cart is empty', cart: []})

            const orderItems = await Promise.all(cartItems.map(async (e) => {
                // get product detail of cart item
                const productDetail = await Product.findById(e.productId).lean().exec()

                // update isCheckedOut of cart item to true
                await Cart.findByIdAndUpdate(e._id, { isCheckedOut: true })

                // returns a new instance of ConstructCartItemObject
                return new ConstructCartItemObject(productDetail?.name as string, productDetail?.price as number, productDetail?.image as string, e.quantity, e.orderNote, e._id.toString())
            }))

            // create new checkout 
            const newCheckout = await Checkout.create({
                orderItems: orderItems,
                createdBy: userID,
                numberOfItems: orderItems.length,
                totalPrice: orderItems.reduce((accumulator, currentValue) => accumulator + Math.round(currentValue.itemPrice * currentValue.itemQuantity), 0),
                status: 0
            })

            res.status(201).json({ message: 'Items have been checked out successfully', newCheckout })

        } catch (err) {
            res.status(500).json({ message: 'An error occurred', err })
        }
    }
}

export default cartController