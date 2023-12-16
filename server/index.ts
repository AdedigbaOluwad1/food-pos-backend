import express from 'express'
import mongoose from "mongoose"
import cors from "cors"
import router from './routes/auth-routes';
import productsRoutes from './routes/products-routes';
import { config } from 'dotenv';

const app = express();
config()
app.use(express.json());
app.use(cors())
app.use('/auth', router)
app.use('/products', productsRoutes)

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

