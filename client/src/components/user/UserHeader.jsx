import React from 'react';

const UserHeader = ({ user }) => {
    return (
        <div className="flex items-center gap-4 mb-6">
            <img
                src={user.avatar_url}
                alt={user.login}
                className="w-20 h-20 rounded-full border border-gray-500"
            />
            <div>
                <h1 className="text-2xl font-bold">{user.login}</h1>
                {user.bio && <p className="text-gray-400">{user.bio}</p>}
                <p className="text-sm text-gray-500">
                    {user.public_repos} Public Repos • {user.followers} Followers • {user.following} Following
                </p>
            </div>
        </div>
    );
};

export default UserHeader;
