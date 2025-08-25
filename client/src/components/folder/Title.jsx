import React from 'react'
import { Link } from 'react-router-dom'

const Title = ({ clearStates, username, repo }) => {
    return (
        <h2 className=' pl-4 font-pleinbold tracking-tighter my-3  w-screen flex justify-start '>
            <Link onClick={clearStates} to={`/${username}/${repo}`} className='text-xl md:text-8xl'>
                <span className='text-[#ffffff50]'>{username}/</span>{repo}
            </Link>
        </h2>
    )
}

export default Title