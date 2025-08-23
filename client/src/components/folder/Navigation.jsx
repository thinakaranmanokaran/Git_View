import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

const Navigation = ({ folder, files, API_URL, GITHUB_TOKEN, username, repo, path }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [openFolders, setOpenFolders] = useState([]);
    const [allFiles, setAllFiles] = useState([]);
    const [loadedFolders, setLoadedFolders] = useState({});

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
    }, [API_URL, GITHUB_TOKEN, username, repo]); // Removed path dependency

    const handleToggle = async (folder) => {
        if (openFolders.includes(folder.sha)) {
            // close folder
            setOpenFolders(openFolders.filter((id) => id !== folder.sha));
        } else {
            // open folder
            setOpenFolders([...openFolders, folder.sha]);

            // fetch contents if not already loaded
            if (!loadedFolders[folder.sha]) {
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
            .map((file) => (
                <div key={file.sha}>
                    <div className='flex items-center h-10 pl-3 overflow-hidden hover:bg-grey rounded-md transition justify-between  '
                        style={{ marginLeft: `${depth * 20 + 12}px` }}>
                        <div className='text-[15px] '>{file.name}</div>
                        {file.type === 'dir' &&
                            (
                                openFolders.includes(file.sha) ?
                                    <div className='flex items-center hover:bg-gray-600 px-2 h-full ' onClick={() => handleToggle(file)}>
                                        <IoIosArrowDown />
                                    </div>
                                    :
                                    <div className='flex items-center hover:bg-gray-600 px-2 h-full ' onClick={() => handleToggle(file)}>
                                        <IoIosArrowForward />
                                    </div>
                                )
                        }
                    </div>
                    {openFolders.includes(file.sha) && file.type === 'dir' && loadedFolders[file.sha] && (
                        <div>
                            {renderFiles(loadedFolders[file.sha], depth + 1)}
                        </div>
                    )}
                </div>
            ));
    };

    return (
        <div className='min-w-56 w-fit max-w-66 py-3 border-r-grey border-r-1 flex flex-col justify-start px-1 h-full max-h-[80vh] overflow-y-auto scrollbar-none'>
            {Array.isArray(allFiles) && renderFiles(allFiles)}
        </div>
    )
}

export default Navigation;