import React from 'react';
import { Link } from 'react-router-dom';

const RepoCard = ({ repo }) => {
    return (
        <div className="bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition">
            <Link to={`/${repo.owner.login}/${repo.name}`}>
                <h2 className="text-lg font-semibold text-blue-400 hover:underline">
                    {repo.name}
                </h2>
            </Link>
            {repo.fork && (
                <span className="inline-block bg-yellow-600 text-xs px-2 py-1 rounded mt-1">
                    Forked
                </span>
            )}
            <p className="text-sm text-gray-400 mt-2">
                {repo.description || 'No description'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
                ⭐ {repo.stargazers_count} • 🍴 {repo.forks_count}
            </p>
        </div>
    );
};

export default RepoCard;
