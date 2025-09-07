import React from "react";
import { Link } from "react-router-dom";

const Title = ({ clearStates, username, repo }) => {
    return (
        <div
            className="relative w-screen overflow-x-auto overflow-y-hidden scrollbar-none whitespace-nowrap"
        >
            {/* right side shadow effect */}
            {/* <div className="pointer-events-none fixed right-0 top-0 h-full w-12 bg-gradient-to-l from-black to-transparent max-h-32" /> */}

            <h2 className="pl-4 font-pleinbold tracking-tighter my-3 pr-10 inline-block">
                <Link
                    onClick={clearStates}
                    to={`/${username}/${repo}`}
                    className="text-xl md:text-8xl"
                >
                    <span className="text-[#ffffff50]">{username}/</span>
                    {repo}
                </Link>
            </h2>
        </div>
    );
};

export default Title;
