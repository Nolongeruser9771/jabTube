import React from 'react'
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import UserContext from '../../context/UserContext/UserContext'

function RegisteredUserRoutes() {
    const { user } = useContext(UserContext)

    return user ? <Outlet /> : <Navigate to={'/'} />
}

export default RegisteredUserRoutes
