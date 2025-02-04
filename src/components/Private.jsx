import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const Private = () => {
    const auth = localStorage.getItem('user')
    return auth ? <Outlet /> : <Navigate to="/login"></Navigate>
}

export default Private
