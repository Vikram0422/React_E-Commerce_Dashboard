import React, { useEffect, useState } from 'react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [editProductId, setEditProductId] = useState(null);
    const [editProductData, setEditProductData] = useState({
        name: '',
        price: '',
        category: '',
        brand: '',
    });

    // Get the user ID and token from localStorage
    const userID = JSON.parse(localStorage.getItem('user'))?._id;
    const token = localStorage.getItem('token');  // JWT token

    // Fetch products based on search criteria or by user ID
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://192.168.1.5:5000/product-search`, {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Include token in the request
                },
            });
            const data = await response.json();

            if (data.success) {
                const userProducts = data.data.filter(product => product.userID === userID);
                setProducts(userProducts);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    // Call fetchProducts when the component mounts
    useEffect(() => {
        if (userID && token) {
            fetchProducts();
        }
    }, [userID, token]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Delete a product
    const deleteProduct = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?"); // Confirmation dialog
        if (!confirmDelete) return; // Exit if the user cancels

        try {
            const response = await fetch(`http://192.168.1.5:5000/delete-product/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Include token in delete request
                },
            });

            const result = await response.json();
            if (result.success) {
                setProducts(products.filter(product => product._id !== id));
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            alert('Error deleting product');
        }
    };

    // Edit a product
    const handleEdit = (product) => {
        setEditProductId(product._id);
        setEditProductData({
            name: product.name,
            price: product.price,
            category: product.category,
            brand: product.brand,
        });
    };

    const handleEditChange = (e) => {
        setEditProductData({
            ...editProductData,
            [e.target.name]: e.target.value,
        });
    };

    const saveEdit = async (id) => {
        try {
            const response = await fetch(`http://192.168.1.5:5000/edit-product/${id}`, {
                method: 'PUT',
                body: JSON.stringify(editProductData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Include token in edit request
                },
            });

            const result = await response.json();
            if (result.success) {
                alert('Product updated successfully');
                setProducts(products.map((product) =>
                    product._id === id ? { ...product, ...editProductData } : product
                ));
                setEditProductId(null); // Exit edit mode
            } else {
                alert('Error updating product');
            }
        } catch (error) {
            alert('Failed to update product');
        }
    };

    // Cancel the edit operation
    const cancelEdit = () => {
        setEditProductId(null); // Exit edit mode
    };

    // Filter products based on search query for name, price, category, and brand
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.price.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-[85.5vh] bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white mt-10 mb-20 p-6 rounded-lg shadow-md w-full max-w-3xl">
                <div className="flex justify-between items-center mb-6 flex-wrap">
                    <h2 className="text-3xl font-bold text-gray-800 w-full sm:w-auto">Your Products</h2>

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search products..."
                        className="mt-4 sm:mt-0 px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 md:w-80 lg:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500" // Additional styles
                    />
                </div>

                {filteredProducts.length === 0 ? (
                    <p className="text-gray-500 text-center">No products found for your account.</p>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredProducts.map((product) => (
                            <li key={product._id} className="border border-gray-300 rounded-lg p-4 bg-white shadow-md flex flex-col">
                                {editProductId === product._id ? (
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editProductData.name}
                                            onChange={handleEditChange}
                                            className="mb-2 px-4 py-2 border border-gray-300 rounded-lg w-full"
                                            placeholder="Product Name"
                                        />
                                        <input
                                            type="text"
                                            name="price"
                                            value={editProductData.price}
                                            onChange={handleEditChange}
                                            className="mb-2 px-4 py-2 border border-gray-300 rounded-lg w-full"
                                            placeholder="Price"
                                        />
                                        <input
                                            type="text"
                                            name="category"
                                            value={editProductData.category}
                                            onChange={handleEditChange}
                                            className="mb-2 px-4 py-2 border border-gray-300 rounded-lg w-full"
                                            placeholder="Category"
                                        />
                                        <input
                                            type="text"
                                            name="brand"
                                            value={editProductData.brand}
                                            onChange={handleEditChange}
                                            className="mb-2 px-4 py-2 border border-gray-300 rounded-lg w-full"
                                            placeholder="Brand"
                                        />
                                        <div className="flex justify-between mt-4">
                                            <button
                                                onClick={() => saveEdit(product._id)}
                                                className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition w-full sm:w-auto">
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition w-full sm:w-auto">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-lg font-bold text-gray-700 mb-1">{product.name}</h3>
                                        <p className="text-gray-600 mb-1">Price: <span className="text-gray-900">${product.price}</span></p>
                                        <p className="text-gray-600 mb-1">Category: <span className="text-gray-900">{product.category}</span></p>
                                        <p className="text-gray-600 mb-1">Brand: <span className="text-gray-900">{product.brand}</span></p>
                                        <div className="flex justify-between mt-4">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition w-full sm:w-auto">
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteProduct(product._id)}
                                                className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition w-full sm:w-auto">
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ProductList;
