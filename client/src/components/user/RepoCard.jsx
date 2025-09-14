import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FaStar, FaBook, FaUserFriends, FaUserPlus } from "react-icons/fa";
import { VscRepoForked } from "react-icons/vsc";
import { FiGithub } from "react-icons/fi";

const RepoCard = ({ repo }) => {

    const [timeAgo, setTimeAgo] = useState(formatTimeAgo(repo.pushed_at));

    function formatTimeAgo(dateString) {
        const now = new Date();
        const pushedDate = new Date(dateString);
        const diff = Math.floor((now - pushedDate) / 1000); // difference in seconds

        if (diff < 60) {
            return `${diff} sec${diff !== 1 ? "s" : ""} ago`;
        } else if (diff < 3600) {
            const mins = Math.floor(diff / 60);
            return `${mins} min${mins !== 1 ? "s" : ""} ago`;
        } else if (diff < 86400) {
            const hours = Math.floor(diff / 3600);
            return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
        } else if (diff < 604800) {
            const days = Math.floor(diff / 86400);
            return `${days} day${days !== 1 ? "s" : ""} ago`;
        } else {
            if (pushedDate.getFullYear() === now.getFullYear()) {
                return pushedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }); // Example: "Sep 6"
            } else {
                return pushedDate.toLocaleDateString("en-US"); // Example: "09/06/2024"
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeAgo(formatTimeAgo(repo.pushed_at));
        }, 60000); // refresh every 60s
        return () => clearInterval(interval);
    }, [repo.pushed_at]);

    return (
        <div className="bg-[#191919] rounded-2xl p-6 font-general tracking-wide shadow hover:shadow-md transition flex flex-col justify-between ">
            <div>
                <div className="flex space-x-2 justify-between">
                    <div className="flex space-x-2 h-fit ">
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

                </div>
                <p className="text-sm text-gray-400 mt-2">
                    {repo.description || 'No description'}
                </p>
            </div>
            <p className="text-sm text-gray-500 mt-3 flex items-center justify-between">
                <div className="space-x-2 flex items-center">
                    <div>
                        <FaStar className="inline-block" /> {repo.stargazers_count} • <VscRepoForked className="inline-block text-base" /> {repo.forks_count}
                    </div>
                    <a href={`https://github.com/${repo.owner.login}/${repo.name}`} target="_blank" rel="noopener noreferrer" className=' text-[#ffffff40] hover:text-white hover:bg-[#ffffff20] p-2.5 rounded-xl hover:scale-105 transition-all duration-300 text-base'><FiGithub /></a>
                </div>
                <div className='space-x-2 flex items-center  '>
                    <p className="text-xs text-gray-400">
                        Last updated: {timeAgo}
                    </p>
                </div>

            </p>
        </div>
    );
};

export default RepoCard;
