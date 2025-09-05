import React from 'react';
import { LuBadgeCheck } from "react-icons/lu";
import { HiBadgeCheck } from "react-icons/hi";
import { FaStar, FaBook, FaUserFriends, FaUserPlus } from "react-icons/fa";
import { GoProjectSymlink } from "react-icons/go";

const UserHeader = ({ user }) => {
    return (
        <div className="flex items-center gap-4 mb-12">
            <img
                src={user.avatar_url}
                alt={user.login}
                className="w-60 h-60 rounded-4xl  "
            />
            <div>
                <div className={`flex  space-x-2 items-end ${!user.bio ? 'mb-5' : 'mb-0'}`}>
                    <h1 className="text-5xl font-pleinbold  ">{user.name ? user.name : user.login}</h1>
                    {user.name && <h1 className="text-4xl font-intermid tracking-tight text-gray-400 ">{user.login}</h1>}
                    {user.login === "thinakaranmanokaran" && <HiBadgeCheck className="text-blue-300 w-8 h-8" title="Developer" />}
                </div>
                {user.bio && <p className="text-gray-400 font-generallight text-xl max-w-2xl my-4 mb-5 ">{user.bio}</p>}
                <p className="font-general text-lg flex flex-wrap gap-2">
                    {/* Public Repos */}
                    { user.public_repos > 0 && <span className="bg-[#FF9149] px-4 py-1 flex items-center gap-x-2 rounded-full text-black w-fit">
                        <FaBook /> {user.public_repos} Repos
                    </span>}

                    {/* Total Stars */}
                    { user.total_stars > 0 && <span className="bg-yellow-300 px-4 py-1 flex items-center gap-x-2 rounded-full text-black w-fit">
                        <FaStar /> {user.total_stars || 0} Stars
                    </span>}

                    {/* Followers */}
                    { user.followers > 0 && <span className="bg-[#60B5FF] px-4 py-1 flex items-center gap-x-2 rounded-full text-black w-fit">
                        <FaUserFriends /> {user.followers} Followers
                    </span>}

                    {/* Following */}
                    { user.following > 0 && <span className="bg-[#FCC6FF] px-4 py-1 flex items-center gap-x-2 rounded-full text-black w-fit">
                        <FaUserPlus /> {user.following} Following
                    </span>}
                </p>
            </div>
        </div>
    );
};

export default UserHeader;
