import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaBook, FaUserFriends, FaUserPlus } from "react-icons/fa";
import { VscRepoForked } from "react-icons/vsc";

const RepoCard = ({ repo }) => {
    return (
        <div className="bg-[#191919] rounded-2xl p-6 font-general tracking-wide shadow hover:shadow-md transition">
            <div className="flex space-x-2">
                <Link to={`/${repo.owner.login}/${repo.name}`}>
                    <h2 className="text-lg font-semibold text-blue-400 hover:underline">
                        {repo.name}
                    </h2>
                </Link>
                {
                    repo.homepage && (<a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#FCC6FF] text-xs px-2 py-1 text-black rounded-full mt-1">Live Link</a>)
                }
                {repo.fork && (
                    <span className="inline-block bg-[#FF9149] text-xs px-2 py-1 text-black rounded-full mt-1">
                        Forked
                    </span>
                )}
            </div>
            <p className="text-sm text-gray-400 mt-2">
                {repo.description || 'No description'}
            </p>
            <p className="text-sm text-gray-500 mt-3">
                <FaStar className="inline-block" /> {repo.stargazers_count} • <VscRepoForked className="inline-block text-base" /> {repo.forks_count}
            </p>
        </div>
    );
};

export default RepoCard;
