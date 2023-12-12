import { Request, Response } from "express"
import Product from "../../models/productModel"

const productController = {
    post: async(req: Request, res: Response) => {
        try {
            const product = await Product.create(req.body)
            res.status(200).json(product)
        } catch (error: any) {
            console.log(error) 
            res.status(500).json({ message: error.message })  
        }
    }
}

export default productController