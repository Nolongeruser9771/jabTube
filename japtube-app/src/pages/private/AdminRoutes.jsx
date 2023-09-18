import React, { useState } from 'react'
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import UserContext from '../../context/UserContext/UserContext'

function AdminRoutes() {
    const { user } = useContext(UserContext)
    const roleList = user ? user.roles.map((role) => role.role) : []
    const isAdmin = roleList.includes('ADMIN')

    return isAdmin ? <Outlet /> : <Navigate to={'/'} />
}

export default AdminRoutes
