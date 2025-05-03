import React from 'react'
import { Outlet } from 'react-router-dom'

const FolderLayout = () => {
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default FolderLayout