import React from 'react'
import { Routes, Route } from 'react-router-dom'
import FolderLayout from '../layouts/FolderLayout'
import FolderPage from '../pages/Folder'

const Folder = () => {
    return (
        <Routes>
            <Route path='/:username/:repo/*' element={<FolderLayout />}>
                <Route path='*' element={<FolderPage />} />
            </Route>
        </Routes>
    )
}

export default Folder
