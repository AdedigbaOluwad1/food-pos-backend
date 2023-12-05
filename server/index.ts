import express from "express"
import mongoose from "mongoose"
import Product from "./models/productModels";

const app = express();

app.use(express.json());

// update product by ID
app.put('/products/:id', async(req, res) => {
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
});

// get all products
app.get('/products', async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (err: any) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// get specific product by ID
app.get('/products/:id', async(req, res) => {
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
});

// create product
app.post('/product', async(req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product)
    } catch (error: any) {
        console.log(error) 
        res.status(500).json({ message: error.message })  
    }
});

// delete product
app.delete('/products/:id', async(req, res) => {
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
})

// connection to database
mongoose.connect('mongodb+srv://boatech4good:e4AdHEnRcR7WogRF@cluster0.3pzvd3i.mongodb.net/Food-App-API?retryWrites=true&w=majority')
.then(() => {
    console.log('Connected to MongoDB Successfully');
    app.listen(3000, () => {
        console.log('Server started on port 3000')
    })
})
.catch((e) => {
    console.log(e)
});

