import mongoose, { mongo } from "mongoose";
import { User } from "./authModel";

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            require: [true, 'Please provide a user id'],
        },
        productId: {
            type: String,
            require: [true, 'A product id is required']
        },
        quantity: {
            type: Number,
            default: 1
        },
        isCheckedOut: {
            type: Boolean,
            default: false
        },
        orderNote: {
            type: String,
            default: ''
        }
    },
    { 
        timestamps: true
    }
)

const checkoutSchema = new mongoose.Schema(
    {
        orderItems: {
            type: Array,
            default: [],
            require: [true, 'Please add items to your cart to continue']
        },
        createdBy: {
            type: String,
            require: [true, 'A user is required']
        },
        totalPrice: {
            type: Number,
            default: 0
        },
        status: {
            type: Number,
            default: 0
        },
        numberOfItems: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true   
    }
)

const Cart = mongoose.model('Cart', cartSchema)
const Checkout = mongoose.model('Checkout', checkoutSchema)

export {
    Cart,
    Checkout
}