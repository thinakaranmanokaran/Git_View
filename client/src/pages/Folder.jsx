import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

import { Breadcrumbs, DownloadButton, ErrorMessageBox, FileGrid, FilePreview, FolderHeader, FolderNavigation, FolderTitle, LoaderBar } from '../components';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const FolderPage = () => {
    const { username, repo } = useParams();
    const location = useLocation();
    const path = location.pathname.replace(`/${username}/${repo}`, '').replace(/^\/+/, '') || '';

    const [files, setFiles] = useState([]);
    const [fileContent, setFileContent] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isPrivateRepo, setIsPrivateRepo] = useState(false);
    const [status, setStatus] = useState("");          // For user-readable status
    const [isLoading, setIsLoading] = useState(false); // For general loading spinner
    const [progress, setProgress] = useState(0);
    const [showLoader, setShowLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorCode, setErrorCode] = useState(0);

    const API_URL = import.meta.env.VITE_API_URL;
    const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;


    useEffect(() => {
        let interval;
        if (isLoading) {
            setShowLoader(true);
            setProgress(0);
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev < 90) return prev + 5;
                    return prev;
                });
            }, 200);
        } else {
            setProgress(100); // finish
            setTimeout(() => {
                setShowLoader(false); // hide loader after fill
                setProgress(0); // reset quietly for next use
            }, 600); // wait for the bar to finish animating
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const fetchFiles = async () => {
        setIsLoading(true);  // start loader when fetching new folder
        try {
            const res = await axios.get(
                `${API_URL}/repos/${username}/${repo}/contents/${path}`,
                {
                    headers: {
                        Authorization: `Bearer ${GITHUB_TOKEN}`,
                    },
                }
            );

            const fileList = res.data;

            let updatedFiles = [];
            if (Array.isArray(fileList)) {
                updatedFiles = await Promise.all(
                    fileList.map(async (file) => {
                        if (file.type === 'dir') {
                            try {
                                const folderRes = await axios.get(file.url, {
                                    headers: {
                                        Authorization: `Bearer ${GITHUB_TOKEN}`,
                                    },
                                });
                                return {
                                    ...file,
                                    hasContent: folderRes.data.length > 0,
                                };
                            } catch (err) {
                                console.error('Folder fetch error:', err);
                                return { ...file, hasContent: false };
                            }
                        }
                        return file;
                    })
                );
            } else {
                // it's a file object, not array
                updatedFiles = [fileList];
            }

            setFiles(updatedFiles);
            setErrorMessage(""); // clear old error if retry succeeds
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) {
                    // Handle both private repo + non-existing repo here
                    setErrorMessage("This repository is either private or does not exist. Please check the details and try again.");
                    setErrorCode(1)
                } else {
                    setErrorMessage(
                        `Error: ${err.response.statusText || "Something went wrong."}`
                    );
                    setErrorCode(2);
                }
            } else {
                console.error("Axios error object:", err);
                setErrorMessage("Network error. Please try again.");
                setErrorCode(3);
            }
        } finally {
            setIsLoading(false); // stop loader once done
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [username, repo, path]);


    useEffect(() => {
        const fetchFile = async () => {
            const fileName = path.split('/').pop();
            const isFile = /\.[a-z0-9]+$/i.test(fileName);

            if (isFile) {
                setIsLoading(true);
                try {
                    const res = await fetch(
                        `https://raw.githubusercontent.com/${username}/${repo}/main/${path}`
                    );
                    const text = await res.text();
                    setFileContent(text);
                    setFileName(fileName);
                } catch (err) {
                    console.error("File fetch error:", err);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setFileContent(null);
                setFileName('');
            }
        };

        fetchFile();
    }, [path]);

    const nonCodeExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.mp4', '.webm', '.mov', '.pdf', '.zip', '.ico', '.webp'];

    const isCodeFile = (fileName) => {
        return !nonCodeExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    };

    const handleDownloadFolder = async () => {
        setIsLoading(true);
        setStatus("Fetching file tree...");

        const zip = new JSZip();
        const basePath = path || '';
        const folderName = basePath || repo;
        const RAW_BASE = `https://raw.githubusercontent.com/${username}/${repo}/main`;

        try {
            const treeRes = await axios.get(
                `${API_URL}/repos/${username}/${repo}/git/trees/main?recursive=1`
            );
            const allFiles = treeRes.data.tree.filter(item => item.type === 'blob');

            const filesToDownload = basePath
                ? allFiles.filter(file => file.path.startsWith(basePath + '/'))
                : allFiles;

            const MAX_CONCURRENT_DOWNLOADS = 20;
            let downloaded = 0;

            setStatus(`Downloading ${filesToDownload.length} files...`);

            const downloadFile = async (file) => {
                const rawUrl = `${RAW_BASE}/${file.path}`;
                try {
                    const res = await fetch(rawUrl);
                    if (!res.ok) throw new Error(`Failed to fetch ${file.path}`);
                    const blob = await res.blob();
                    zip.file(file.path, blob, { binary: true });
                    downloaded++;
                    setStatus(`Downloaded: ${file.path}`);
                } catch (err) {
                    console.error('Error downloading file:', file.path, err);
                }
            };

            const chunks = [];
            for (let i = 0; i < filesToDownload.length; i += MAX_CONCURRENT_DOWNLOADS) {
                chunks.push(filesToDownload.slice(i, i + MAX_CONCURRENT_DOWNLOADS));
            }

            for (const chunk of chunks) {
                await Promise.allSettled(chunk.map(downloadFile));
            }

            setStatus("Zipping files...");
            const blob = await zip.generateAsync({
                type: 'blob',
                compression: 'STORE'
            });

            saveAs(blob, `${folderName}.zip`);
            setStatus(`✅ Downloaded and zipped ${downloaded} files.`);
        } catch (err) {
            console.error('Error creating zip archive:', err);
            setStatus("❌ Download failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    const clearStates = () => {
        // setFiles([]);
        // setFileContent(null);
        // setFileName('');
        setIsPrivateRepo(false);
        setStatus("");
        setIsLoading(false);
    }

    return (
        <div className="bg-dark text-white min-h-screen py-2 overflow-x-hidden">
            <FolderTitle clearStates={clearStates} repo={repo} username={username} />
            <FolderHeader clearStates={clearStates} path={path} repo={repo} username={username} handleDownloadFolder={handleDownloadFolder} isLoading={isLoading} />

            {errorMessage ? (
                <ErrorMessageBox errorMessage={errorMessage} errorCode={errorCode} username={username} fetchFiles={fetchFiles} />
            ) :
                <div className='w-full flex justify-start h-full'>
                    <FolderNavigation API_URL={API_URL} GITHUB_TOKEN={GITHUB_TOKEN} files={files} repo={repo} username={username} path={path} />
                    {fileContent
                        ? <FilePreview fileContent={fileContent} fileName={fileName} isCodeFile={isCodeFile} />
                        : <FileGrid files={files} username={username} repo={repo} path={path} clearStates={clearStates} isCodeFile={isCodeFile} />
                    }
                </div>
            }

            <LoaderBar showLoader={showLoader} progress={progress} />
        </div>
    );
};

export default FolderPage;
