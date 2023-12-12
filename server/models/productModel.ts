import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter the product name"]
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        price: {
            type: Number,
            required: [true, "Please enter a price"]
        },
        image: {
            type: String,
            required: [true, "Please enter image"]
        }
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model('Product', productSchema)

export default Product