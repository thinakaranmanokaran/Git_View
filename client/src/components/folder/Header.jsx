import React from 'react'
import Breadcrumbs from './Breadcrumbs'
import { Link } from 'react-router-dom'
import DownloadButton from './DownloadButton'

const Header = ({ username, repo, path, clearStates, handleDownloadFolder, isLoading, status }) => {
    return (
        <div className=' border-y-1 border-grey min-h-16 flex justify-between items-center px-4 '>
            <div>
                <Breadcrumbs
                    username={username} repo={repo} path={path} clearStates={clearStates} />
            </div>
            <div>
                <DownloadButton handleDownloadFolder={handleDownloadFolder} isLoading={isLoading} status={status} />
            </div>
        </div>
    )
}

export default Header