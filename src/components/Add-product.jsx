import React, { useState, useEffect } from 'react';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [userID, setUserID] = useState('');

    // Fetch userID from localStorage when component mounts
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser._id) {
            setUserID(storedUser._id);
        }
    }, []);

    const addProduct = async (e) => {
        e.preventDefault();

        // Retrieve the JWT token from localStorage
        const token = localStorage.getItem('token');

        const productData = { name, price, category, brand, userID };

        let result = await fetch('http://192.168.1.5:5000/add-product', {
            method: 'POST',
            body: JSON.stringify(productData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the JWT token in the request
            },
        });

        result = await result.json();

        if (result.message === 'Product added successfully') {
            alert('Product added successfully');
            // Clear the form after successful submission
            setName('');
            setPrice('');
            setCategory('');
            setBrand('');
        } else {
            alert(result.message || 'Error adding product');
        }
    };

    return (
        <div className="min-h-[85.5vh] bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Product</h2>
                <form onSubmit={addProduct}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Product Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter product name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-gray-700 font-medium mb-2">Price</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter product price"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Category</label>
                        <input
                            type="text"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter product category"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="brand" className="block text-gray-700 font-medium mb-2">Brand</label>
                        <input
                            type="text"
                            id="brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter product brand"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out">
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
