import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom"
import { IoFolder, IoFolderOpen } from "react-icons/io5";
import { FaFileLines } from "react-icons/fa6";

const Navigation = ({ API_URL, GITHUB_TOKEN, username, repo }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [openFolders, setOpenFolders] = useState([]);
    const [allFiles, setAllFiles] = useState([]);
    const [loadedFolders, setLoadedFolders] = useState({});
    const [loadingFolders, setLoadingFolders] = useState({}); // 👈 track per-folder loading

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const res = await axios.get(`${API_URL}/repos/${username}/${repo}/contents`, {
                    headers: {
                        Authorization: `Bearer ${GITHUB_TOKEN}`,
                    },
                });
                setAllFiles(res.data);
                console.log('Fetched root files for navigation:', res.data);
            } catch (err) {
                console.error('Root folder fetch error:', err);
            }
        };

        fetchFiles();
    }, [API_URL, GITHUB_TOKEN, username, repo]);

    const handleToggle = async (folder) => {
        if (openFolders.includes(folder.sha)) {
            // close folder
            setOpenFolders(openFolders.filter((id) => id !== folder.sha));
        } else {
            // open folder
            setOpenFolders([...openFolders, folder.sha]);

            // fetch contents if not already loaded
            if (!loadedFolders[folder.sha]) {
                setLoadingFolders((prev) => ({ ...prev, [folder.sha]: true })); // 👈 start loading

                try {
                    const res = await axios.get(
                        `${API_URL}/repos/${username}/${repo}/contents/${folder.path}`,
                        {
                            headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
                        }
                    );
                    setLoadedFolders((prev) => ({ ...prev, [folder.sha]: res.data }));
                } catch (err) {
                    console.error("Subfolder fetch error:", err);
                } finally {
                    setLoadingFolders((prev) => ({ ...prev, [folder.sha]: false })); // 👈 stop loading
                }
            }
        }
    };

    const renderFiles = (files, depth = 0) => {
        return files
            .sort((a, b) => {
                if (a.type === 'dir' && b.type !== 'dir') return -1;
                if (a.type !== 'dir' && b.type === 'dir') return 1;
                return a.name.localeCompare(b.name);
            })
            .map((file) => {
                const isOpen = openFolders.includes(file.sha);
                return (
                    <div key={file.sha}>
                        <div
                            className={`
                            flex items-center h-10 pl-3 overflow-hidden rounded-r-md transition justify-between 
                            ${isOpen && file.type === 'dir' ? 'bg-[#ffffff20]' : 'hover:bg-[#ffffff10] '} 
                            ${depth > 0 ? 'border-l border-gray-600' : ''}
                        `}
                            style={{ marginLeft: `${depth * 20 + 12}px` }}
                        >
                            {/* File/Folder Name */}
                            <Link
                                to={`/${username}/${repo}/${file.path}`}
                                className="text-[15px] flex items-center cursor-pointer w-full h-full"
                                onClick={(e) => {
                                    if (file.type === "dir") {
                                        e.preventDefault(); // stop navigation for folders
                                        handleToggle(file); // expand/collapse
                                    }
                                    // for files → DO NOT preventDefault → navigation works
                                }}
                            >
                                <span
                                    className={`text-lg mr-1 ${file.type === "dir" ? "text-blue" : "text-gray-400"}`}
                                >
                                    {file.type === "dir"
                                        ? isOpen
                                            ? <IoFolderOpen />
                                            : <IoFolder />
                                        : <FaFileLines />}
                                </span>
                                {file.name}
                            </Link>

                            {/* Folder Toggle Icon */}
                            {file.type === 'dir' && (
                                <div
                                    className={`flex items-center hover:bg-[#ffffff40] ${isOpen && "bg-[#ffffff40]"} px-2 h-full`}
                                    onClick={() => handleToggle(file)}
                                >
                                    {loadingFolders[file.sha] ? (
                                        <span className="w-4 h-4 border-2 border-gray-300 rounded-full animate-spin border-t-white"></span>
                                    ) : (
                                        isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sub-Files */}
                        {isOpen && file.type === 'dir' && loadedFolders[file.sha] && (
                            <div>{renderFiles(loadedFolders[file.sha], depth + 1)}</div>
                        )}
                    </div>
                );
            });
    };


    return (
        <div className='min-w-56 sticky top-20 select-none w-fit max-w-66 py-3 border-grey border-b-1 border-r-1 flex flex-col justify-start px-1 h-full min-h-[50vh] max-h-[80vh] overflow-y-auto scrollbar-none'>
            {Array.isArray(allFiles) && renderFiles(allFiles)}
        </div>
    );
}

export default Navigation;
