import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import images from '../assets/images';
import { IoIosArrowForward } from "react-icons/io";
import CodeViewer from '../components/global/CodeViewer';
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


    const API_URL = import.meta.env.VITE_API_URL;
    const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

    useEffect(() => {
        axios
            .get(`${API_URL}/repos/${username}/${repo}/contents/${path}`, {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                },
            })
            .then(async (res) => {
                const fileList = res.data;

                const updatedFiles = await Promise.all(
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

                setFiles(updatedFiles);
            })
            .catch((err) => {
                if (err.response && (err.response.status === 403 || err.response.status === 404)) {
                    setIsPrivateRepo(true);
                } else {
                    console.error('Main fetch error:', err);
                }
            });
    }, [username, repo, path]);

    useEffect(() => {
        const fileName = path.split('/').pop();
        const isFile = /\.[a-z0-9]+$/i.test(fileName);  // crude check for file

        if (isFile) {
            fetch(`https://raw.githubusercontent.com/${username}/${repo}/main/${path}`)
                .then((res) => res.text())
                .then((text) => {
                    setFileContent(text);
                    setFileName(fileName);
                });
        } else {
            setFileContent(null);
            setFileName('');
        }
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
        <div className="bg-dark text-white min-h-screen p-2 overflow-x-hidden">
            <h2 className='text-4xl font-generalbold my-6 flex justify-center'>
                <Link onClick={clearStates} to={`/${username}/${repo}`} className='text-xl md:text-4xl text-center w-fit'>{repo}</Link>
            </h2>

            {/* Breadcrumb path like src > components > users */}
            <div className='flex justify-start md:justify-center px-4 overflow-x-scroll md:overflow-hidden items-center gap-2 my-4 text-sm font-medium'>
                {path
                    ? path.split('/').map((part, index, arr) => {
                        const subPath = arr.slice(0, index + 1).join('/');
                        return (
                            <span key={index} className="flex items-center gap-1">
                                <Link onClick={clearStates} to={`/${username}/${repo}/${subPath}`} className="bg-grey px-3 py-2 rounded-full hover:bg-blue hover:text-dark transition-colors line-clamp-1 ">
                                    {part}
                                </Link>
                                {index < arr.length - 1 && <span className="text-white"><IoIosArrowForward /></span>}
                            </span>
                        );
                    })
                    : <span className="text-gray-400"></span>}
            </div>

            {path && (
                <div className='text-center mb-4'>
                    <Link onClick={clearStates}
                        to={`/${username}/${repo}/${path.split('/').slice(0, -1).join('/')}`}
                        className="absolute hidden md:block top-6 left-4 font-general px-4 py-2 bg-grey text-white rounded-xl hover:scale-105 transition"
                    >
                        Back
                    </Link>
                    <button
                        onClick={handleDownloadFolder}
                        disabled={isLoading || status}
                        className={`fixed hidden  bottom-6 right-4 font-general px-4 py-2 bg-grey text-white rounded-xl hover:scale-105 transition-all duration-300 md:flex justify-center disabled:cursor-not-allowed disabled:hover:scale-100  cursor-pointer ${isLoading ? "w-16" : status ? "w-80" : "w-52 "}`}
                    >
                        {  isLoading ?  (<div className='w-6 h-6  border-dark border-2 rounded-full border-t-white animate-spin ' ></div> ) : status ? (<p>{status}</p>) : (<span>Download This Folder</span>) }
                    </button>

                </div>
            )}


            {
                isPrivateRepo ? (
                    <div className="text-center text-red-500 text-lg mt-10">
                        This repository is <span className="font-bold">private</span> and cannot be accessed due to our terms and permissions.
                    </div>
                ) : (
                    fileContent && isCodeFile(fileName) ? (
                        <CodeViewer content={fileContent} filename={fileName} />
                    ) : (
                        <ul className='w-full grid grid-cols-2 md:grid-cols-8 gap-y-3'>
                            {Array.isArray(files) && files
                                .sort((a, b) => {
                                    if (a.type === 'dir' && b.type !== 'dir') return -1;
                                    if (a.type !== 'dir' && b.type === 'dir') return 1;
                                    return a.name.localeCompare(b.name);
                                })
                                .map((file) => (
                                    <li key={file.sha}>
                                        <Link
                                            to={isCodeFile(file.name) 
                                                ? `/${username}/${repo}/${path ? path + '/' : ''}${file.name}`
                                                : undefined  // Non-code files won't show up in the URL
                                            } onClick={clearStates}
                                            className="flex flex-col items-center w-fit min-w-40 gap-2 p-2 hover:bg-grey rounded-md transition duration-200 ease-in-out max-w-48"
                                            title={file.name}
                                        >
                                            <img
                                                src={
                                                    file.type === 'dir'
                                                        ? file.hasContent
                                                            ? images.DataFolder
                                                            : images.EmptyFolder
                                                        : /\.(png|jpe?g|svg)$/i.test(file.name)
                                                            ? file.download_url
                                                            : /\.(js)$/i.test(file.name)
                                                                ? images.JavaScript
                                                                : /\.(py)$/i.test(file.name)
                                                                    ? images.Python
                                                                    : images.File
                                                }
                                                alt={file.name}
                                                className='w-24 h-24 object-contain rounded shadow'
                                            />
                                            <div className='text-center w-4/5 text-xs font-general tracking-wide break-words'>
                                                {file.name}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    )
                )
            }
        </div>
    );
};

export default FolderPage;
