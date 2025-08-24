import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
});

export const fetchRepoContents = (username, repo, path = "") => {
    return axiosInstance.get(`/repos/${username}/${repo}/contents/${path}`);
};

export const fetchFolderContents = (url) => {
    return axios.get(url, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    });
};

export const fetchRepoTree = (username, repo) => {
    return axiosInstance.get(`/repos/${username}/${repo}/git/trees/main?recursive=1`);
};
