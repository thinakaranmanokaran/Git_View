import React, { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import images from '../assets/images'
import { IoIosArrowForward } from "react-icons/io";
import CodeViewer from '../components/global/CodeViewer';

const FolderPage = () => {
    const { username, repo } = useParams()
    const location = useLocation()
    const path = location.pathname.replace(`/${username}/${repo}`, '').replace(/^\/+/, '') || ''

    const [files, setFiles] = useState([])
    const [fileContent, setFileContent] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isPrivateRepo, setIsPrivateRepo] = useState(false)

    const API_URL = import.meta.env.VITE_API_URL
    const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN

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
        const fileName = path.split('/').pop()
        const isFile = /\.[a-z0-9]+$/i.test(fileName)  // crude check for file

        if (isFile) {
            fetch(`https://raw.githubusercontent.com/${username}/${repo}/main/${path}`)
                .then((res) => res.text())
                .then((text) => {
                    setFileContent(text)
                    setFileName(fileName)
                })
        } else {
            setFileContent(null)
            setFileName('')
        }
    }, [path])

    const nonCodeExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.mp4', '.webm', '.mov', '.pdf', '.zip', '.ico', '.webp'];

    const isCodeFile = fileName && !nonCodeExtensions.some(ext => fileName.toLowerCase().endsWith(ext));




    return (
        <div className="bg-dark text-white min-h-screen p-2" >
            <h2 className='text-4xl font-generalbold my-6 flex justify-center  ' >
                <Link to={`/${username}/${repo}`} className='text-4xl text-center w-fit  ' >{repo}</Link>
            </h2>
            {/* Breadcrumb path like src > components > users */}
            <div className='flex justify-center px-4  items-center gap-2 my-4 text-sm font-medium'>
                {path
                    ? path.split('/').map((part, index, arr) => {
                        const subPath = arr.slice(0, index + 1).join('/');
                        return (
                            <span key={index} className="flex items-center gap-1">
                                <Link to={`/${username}/${repo}/${subPath}`} className="bg-grey px-3 py-2 rounded-full  hover:bg-blue hover:text-dark transition-colors ">
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
                    <Link
                        to={`/${username}/${repo}/${path.split('/').slice(0, -1).join('/')}`}
                        className="absolute top-6 left-4 font-general px-4 py-2 bg-grey text-white rounded-xl hover:scale-105 transition"
                    >
                        Back
                    </Link>
                </div>
            )}

            {
                isPrivateRepo ? (
                    <div className="text-center text-red-500 text-lg mt-10">
                        This repository is <span className="font-bold">private</span> and cannot be accessed due to our terms and permissions.
                    </div>
                ) : (
                    fileContent && isCodeFile ? (
                        <CodeViewer content={fileContent} filename={fileName} />
                    ) : (

                        <ul className='w-full grid grid-cols-8 gap-y-3 '>
                            {Array.isArray(files) && files
                                .sort((a, b) => {
                                    if (a.type === 'dir' && b.type !== 'dir') return -1;
                                    if (a.type !== 'dir' && b.type === 'dir') return 1;
                                    return a.name.localeCompare(b.name);
                                })
                                .map((file) => (
                                    <li key={file.sha}>
                                        <Link
                                            to={`/${username}/${repo}/${path ? path + '/' : ''}${file.name}`}
                                            className="flex flex-col items-center w-fit min-w-40 gap-2 p-2 hover:bg-grey rounded-md transition duration-200 ease-in-out max-w-48" title={file.name}
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

        </div >
    )
}

export default FolderPage
