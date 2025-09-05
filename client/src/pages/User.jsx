import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { UserHeader, RepoList, ErrorMessageBox, LoaderBar } from '../components';

const User = () => {
    const { username } = useParams();
    const [repos, setRepos] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const API_URL = import.meta.env.VITE_API_URL;
    const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [userRes, repoRes] = await Promise.all([
                    axios.get(`${API_URL}/users/${username}`, {
                        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
                    }),
                    axios.get(`${API_URL}/users/${username}/repos?per_page=100`, {
                        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
                    })
                ]);

                setUserData(userRes.data);
                setRepos(repoRes.data);
                setErrorMessage('');
            } catch (err) {
                console.error('Error fetching user data:', err);
                setErrorMessage('❌ Failed to load user profile. Check username or network.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [username]);

    return (
        <div className="bg-dark text-white min-h-screen p-4">
            {errorMessage ? (
                <ErrorMessageBox errorMessage={errorMessage} />
            ) : (
                <>
                    {userData && <UserHeader user={userData} />}
                    {isLoading ? <LoaderBar showLoader={true} progress={80} /> : <RepoList repos={repos} />}
                </>
            )}
        </div>
    );
};

export default User;
