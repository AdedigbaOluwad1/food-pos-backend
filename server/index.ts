import express from 'express'
import mongoose from "mongoose"
import cors from "cors"
import router from './routes/auth-routes';
import productsRoutes from './routes/products-routes';
import cartRoutes from './routes/cart-routes';
import { config } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();
config()
const swaggerUI = YAML.load('./server/swag.yaml')
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerUI));
app.use(cors({ origin: 'http://localhost:3001'}))
app.use('/auth', router)
app.use('/products', productsRoutes)
app.use('/cart', cartRoutes)
app.disable('x-powered-by')

// connection to database
mongoose.connect('mongodb+srv://boatech4good:e4AdHEnRcR7WogRF@cluster0.3pzvd3i.mongodb.net/Food-App-API?retryWrites=true&w=majority')
.then(() => {
    console.log('Connected to MongoDB Successfully');
    app.listen(3000, () => {
        console.log('Server started on port 3000 ')
    })
})
.catch((e) => {
    console.log(e)
});

