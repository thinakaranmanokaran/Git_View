import React, { useState } from 'react';
import RepoCard from './RepoCard';
import { FaStar } from "react-icons/fa";
import { RiTimer2Line } from "react-icons/ri";
import { MdDriveFileRenameOutline } from "react-icons/md";

const RepoList = ({ repos }) => {
    const [sortType, setSortType] = useState("stars"); // default sort

    if (!repos || repos.length === 0) {
        return <p className="text-gray-400">No repositories found.</p>;
    }

    // 🔥 Sorting logic
    const sortedRepos = [...repos].sort((a, b) => {
        if (sortType === "stars") {
            return b.stargazers_count - a.stargazers_count;
        }
        if (sortType === "updated") {
            return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
        }
        if (sortType === "name") {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });

    return (
        <div>
            {/* 🔘 Sort Controls */}
            <div className="flex justify-end gap-3 mb-4 font-generallight tracking-wide">
                <button
                    onClick={() => setSortType("name")}
                    className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-x-1 transition cursor-pointer ${sortType === "name"
                        ? "bg-[#FCC6FF] text-black"
                        : "bg-[#ffffff10] text-gray-300 hover:bg-[#ffffff20]"
                        }`}
                >
                    <MdDriveFileRenameOutline
                        className={`inline-block text-base ${sortType === "name" ? "text-black" : "text-[#FCC6FF]"
                            }`}
                    />
                    Name
                </button>
                <button
                    onClick={() => setSortType("stars")}
                    className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-x-1 transition cursor-pointer ${sortType === "stars"
                        ? "bg-[#FFD700] text-black"
                        : "bg-[#ffffff10] text-gray-300 hover:bg-[#ffffff20]"
                        }`}
                >
                    <FaStar
                        className={`inline-block text-base ${sortType === "stars" ? "text-black" : "fill-[#FFD700]"
                            }`}
                    />
                    Stars
                </button>

                <button
                    onClick={() => setSortType("updated")}
                    className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-x-1 transition cursor-pointer ${sortType === "updated"
                        ? "bg-[#FF9149] text-black"
                        : "bg-[#ffffff10] text-gray-300 hover:bg-[#ffffff20]"
                        }`}
                >
                    <RiTimer2Line
                        className={`inline-block text-base ${sortType === "updated" ? "text-black" : "text-[#FF9149]"
                            }`}
                    />
                    Last Modified
                </button>
            </div>

            {/* 📦 Repo Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedRepos.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                ))}
            </div>
        </div>
    );
};

export default RepoList;
