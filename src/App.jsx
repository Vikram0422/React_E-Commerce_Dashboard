import React from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import SignUp from './components/SignUp'
import Private from './components/Private'
import Login from './components/Login'
import Logout from './components/Logout'
import AddProduct from './components/Add-product'
import ProductList from './components/Product-list'

function App() {
  return (
    <BrowserRouter>
      <Content />
    </BrowserRouter>
  )
}

function Content() {
  // Get current location (for conditional rendering)
  const location = useLocation();

  // Conditionally render Navbar and Footer only on non-login/signup/logout routes
  const hideNavbarFooter = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/logout';

  return (
    <>
      {/* Conditionally render the Navbar */}
      {!hideNavbarFooter && <Navbar />}

      <Routes>
        {/* Redirect the root ("/") to the login page */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Protected Routes */}
        <Route element={<Private />}>
          <Route path='/home' element={<ProductList/>}></Route>
          <Route path='/add-product' element={<AddProduct />}></Route>
        </Route>

        {/* Public Routes */}
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/logout' element={<Logout />}></Route>
      </Routes>

      {/* Conditionally render the Footer */}
      {!hideNavbarFooter && <Footer />}
    </>
  );
}

export default App;
