const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Generate 100 mock products
let products = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: parseFloat(((Math.random() * 100) + 10).toFixed(2)), // Random price between 10 and 110
    description: `This is the description for Product ${i + 1}`
}));

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. GET all products
app.get('/api/products', (req, res) => {
    res.status(200).json(products);
});

// 2. GET a single product by ID
app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
});

// 3. POST (Create) a new product
app.post('/api/products', (req, res) => {
    const { name, price, description } = req.body;
    
    const newProduct = {
        // Generate a new ID based on the highest existing ID
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: name || 'Unnamed Product',
        price: price || 0,
        description: description || 'No description provided'
    };

    products.push(newProduct);
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
});

// 4. PUT (Update) an existing product completely
app.put('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const { name, price, description } = req.body;
    
    products[index] = {
        id: productId, // Keep the same ID
        name: name || products[index].name,
        price: price || products[index].price,
        description: description || products[index].description
    };

    res.status(200).json({ message: 'Product updated successfully', product: products[index] });
});

// 5. DELETE a product
app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const deletedProduct = products.splice(index, 1);
    res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct[0] });
});

// Start the server
app.listen(PORT, () => {
    // console.log(`Server is running on http://localhost:3000`);
    console.log(`Access the products at http://localhost:3000/api/products`);
});