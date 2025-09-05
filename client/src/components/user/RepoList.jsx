import React from 'react';
import RepoCard from './RepoCard';

const RepoList = ({ repos }) => {
    if (repos.length === 0) {
        return <p className="text-gray-400">No repositories found.</p>;
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map(repo => (
                <RepoCard key={repo.id} repo={repo} />
            ))}
        </div>
    );
};

export default RepoList;
