import { Request, Response } from "express";
import Product from "../../models/productModel";

const productsController = {
    updateProduct: async(req: Request, res: Response) => {
        try {
            const {id} = req.params;
            const product = await Product.findByIdAndUpdate(id, req.body) 
            if(!product){
                res.status(404).json({ message: `No product found with ID of ${id}`})
            } 
            res.status(200).json(product)
        } catch (err: any) {
            res.status(500).json({ message: err.message })
            console.log(err.message)
        }
    },
    getProducts: async(req: Request, res: Response) => {
        try {
            const products = await Product.find({});
            res.status(200).json(products);
        } catch (err: any) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    },
    getProductsById: async(req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const product = await Product.findById(id);
            if(!product){
                res.status(404).json({ message: `No request found with the ID ${id}` })
            }
            res.status(200).json(product);  
        } catch (err: any) {
            console.log(err);
            res.send(500).json({ message: err.message });
        }
    },
    createProduct: async(req: Request, res: Response) => {
        try {
            const product = await Product.create(req.body)
            res.status(200).json(product)
        } catch (error: any) {
            console.log(error) 
            res.status(500).json({ message: error.message })  
        }
    },
    deleteProduct: async(req: Request, res: Response) => {
        try {
            const {id} = req.params;
            const product = await Product.findByIdAndDelete(id); 
            if(!product){
                res.status(404).json({ message: `No request found with ID ${id}`})
            }
            res.status(200).json({ message: 'Product deleted successfully'})
        } catch (err: any) {
            res.status(500).json({ message: err.message })
        } 
    }
}

export default productsController;