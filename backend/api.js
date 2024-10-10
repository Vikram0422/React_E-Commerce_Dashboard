const express = require('express');
require('./db/config');
const User = require('./db/user');
const Product = require('./db/product');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const JwtKey = 'E-comm';  // Secret key for signing JWT

const app = express();

app.use(express.json());
app.use(cors());

// Middleware to verify the token for protected routes
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // token in "Bearer <token>" format

    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        const verified = jwt.verify(token, JwtKey);  // Verify the token with the secret key
        req.user = verified;  // Store decoded user information in req.user
        next();  // Call next() to move to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Sign-up route
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send({ message: 'User already exists with this email' });
        }

        // Create new user
        const newUser = new User({ name, email, password });

        // Save user to database
        const result = await newUser.save();

        // Send success response
        res.status(201).send({ message: 'User created successfully', user: result });
    } catch (error) {
        console.error('Error during sign-up:', error);
        res.status(500).send({ message: 'An error occurred during sign-up' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists in the database
        const user = await User.findOne({ email: email });

        if (user) {
            // Verify password
            if (user.password === password) {
                // Create a JWT token with the user's info
                const token = jwt.sign(
                    { _id: user._id, email: user.email }, // Payload
                    JwtKey, // Secret key
                    { expiresIn: '2h' } // Token expires in 2 hours
                );

                // Convert the user object to plain JavaScript object
                let userWithoutPassword = user.toObject();
                delete userWithoutPassword.password; // Remove the password field

                // Send response with the token and user data without password
                res.send({ message: 'Login successful', token: token, user: userWithoutPassword });
            } else {
                res.status(400).send({ message: 'Invalid password' });
            }
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ message: 'An error occurred' });
    }
});


// Protected route: Adding a product (requires valid token)
app.post('/add-product', verifyToken, async (req, res) => {
    try {
        const { name, brand, category, price } = req.body;
        const userID = req.user._id; // Get user ID from the verified token

        // Create a new product instance
        const newProduct = new Product({
            name,
            brand,
            category,
            price,
            userID
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: 'Product added successfully',
            product: savedProduct
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch all products (public)
app.get('/product-list', async (req, res) => {
    try {
        const products = await Product.find();

        if (products.length > 0) {
            res.status(200).json({
                success: true,
                message: 'Products retrieved successfully',
                data: products
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No products found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
});

// Edit a product (requires valid token)
app.put('/edit-product/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, brand } = req.body;

        const product = await Product.findByIdAndUpdate(
            id,
            { name, price, category, brand },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating product', error: error.message });
    }
});

// Search products (public)
app.get('/product-search', async (req, res) => {
    const searchQuery = req.query.q || '';

    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { brand: { $regex: searchQuery, $options: 'i' } },
                { category: { $regex: searchQuery, $options: 'i' } },
                { price: { $regex: searchQuery, $options: 'i' } }
            ]
        });

        if (products.length > 0) {
            res.json({ success: true, data: products });
        } else {
            res.json({ success: false, message: 'No products found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete a product (requires valid token)
app.delete('/delete-product/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
    }
});

app.listen(5000);
