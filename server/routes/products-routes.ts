import express from 'express'
import productsController from '../controllers/v1/products-controller'

const productsRoutes = express.Router()

productsRoutes.post('/create-product', productsController.createProduct);
productsRoutes.get('/', productsController.getProducts);
productsRoutes.put('/update-product/:id', productsController.updateProduct);
productsRoutes.get('/:id', productsController.getProductsById);
productsRoutes.delete('/:id', productsController.deleteProduct);

export default productsRoutes