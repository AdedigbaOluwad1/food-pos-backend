import express from 'express'
import productsController from '../controllers/v1/product-controller'
import authMiddleWare from '../controllers/v1/authorization-middleware';

const productsRoutes = express.Router()
productsRoutes.post('/create-product', authMiddleWare, productsController.createProduct);
productsRoutes.get('/', authMiddleWare, productsController.getProducts);
productsRoutes.put('/update-product/:id', productsController.updateProduct);
productsRoutes.get('/:id', productsController.getProductsById);
productsRoutes.delete('/:id', productsController.deleteProduct);

export default productsRoutes