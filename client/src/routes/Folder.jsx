import React from 'react'
import { Routes, Route } from 'react-router-dom'
import FolderLayout from '../layouts/FolderLayout'
import FolderPage from '../pages/Folder'
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'

const Folder = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/:username/:repo/*' element={<FolderLayout />}>
                <Route path='*' element={<FolderPage />} />
            </Route>
            <Route path='*' element={<NotFound />} /> {/* Catch-all route */}
        </Routes>
    )
}

export default Folder
