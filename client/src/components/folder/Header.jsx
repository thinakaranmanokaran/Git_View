import React, { useState, useEffect, useRef } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { Link } from "react-router-dom";
import DownloadButton from "./DownloadButton";
import { LuSearch } from "react-icons/lu";
import axios from "axios";

const Header = ({
    username,
    repo,
    path,
    clearStates,
    handleDownloadFolder,
    isLoading,
    status,
}) => {
    const [searchBar, setSearchBar] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [allFiles, setAllFiles] = useState([]); // 🔥 store full repo tree
    const searchRef = useRef(null);
    const inputRef = useRef(null); // add ref for input
    const [avatar, setAvatar] = useState(""); // 🔥 store avatar

    const API_URL = import.meta.env.VITE_API_URL;
    const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
    const [defaultBranch, setDefaultBranch] = useState("main");

    // ✅ fetch default branch
    useEffect(() => {
        const fetchBranch = async () => {
            try {
                const res = await axios.get(`${API_URL}/repos/${username}/${repo}`, {
                    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
                });
                setDefaultBranch(res.data.default_branch || "main");
            } catch (err) {
                console.error("Error fetching default branch:", err);
                setDefaultBranch("main");
            }
        };
        fetchBranch();
    }, [username, repo]);

    // ✅ fetch avatar
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API_URL}/users/${username}`, {
                    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
                });
                setAvatar(res.data.avatar_url);
            } catch (err) {
                console.error("Error fetching user avatar:", err);
            }
        };
        if (username) fetchUser();
    }, [username]);

    // ✅ fetch entire repo tree once
    useEffect(() => {
        const fetchRepoTree = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/repos/${username}/${repo}/git/trees/${defaultBranch}?recursive=1`,
                    {
                        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
                    }
                );
                setAllFiles(res.data.tree.filter((item) => item.type === "blob")); // only files
            } catch (err) {
                console.error("Error fetching repo tree:", err);
            }
        };
        if (defaultBranch) fetchRepoTree();
    }, [username, repo, defaultBranch]);

    // ✅ close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchBar(false);
                setSearchQuery("");
                setSearchResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleSearchBar = () => {
        setSearchBar((prev) => {
            const newState = !prev;
            if (!prev) {
                setTimeout(() => inputRef.current?.focus(), 50); // focus when opening
            }
            return newState;
        });
        setSearchQuery("");
        setSearchResults([]);
    };

    // ✅ Keyboard shortcut (Ctrl + K)
    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setSearchBar(true);
                setTimeout(() => inputRef.current?.focus(), 50); // auto-focus
            }
        };

        window.addEventListener("keydown", handleShortcut);
        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, []);


    // ✅ Debounced global search
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery.trim() === "") {
                setSearchResults([]);
                return;
            }

            const results = allFiles.filter((file) =>
                file.path.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(results);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchQuery, allFiles]);

    return (
        <div className="border-y border-grey min-h-16 flex justify-between items-center px-4">
            <div>
                <Breadcrumbs
                    username={username}
                    repo={repo}
                    path={path}
                    clearStates={clearStates}
                />
            </div>

            <div className="flex items-center space-x-4 font-general">
                {/* 🔎 Search */}
                <div
                    ref={searchRef}
                    className="flex items-center bg-grey p-2 h-10 rounded-xl hover:bg-[#ffffff25] transition-all duration-200 cursor-pointer relative"
                >
                    <LuSearch
                        className="text-white text-2xl cursor-pointer"
                        onClick={toggleSearchBar}
                    />
                    <input
                        ref={inputRef}   // attach ref here
                        type="text"
                        placeholder="Search repo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`text-white bg-transparent outline-0 transition-all duration-300 ease-in-out ${searchBar ? "w-60 opacity-100 px-2" : "p-0 w-0 opacity-0"
                            }`}
                    />
                    {/* Dropdown results */}
                    {searchBar && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 mt-2 w-80 overflow-x-hidden bg-white text-black rounded-md shadow-lg z-50 max-h-72 overflow-y-auto">
                            {searchResults.map((result, index) => (
                                <Link
                                    key={index}
                                    to={`/${username}/${repo}/${result.path}`}
                                    className="block px-4 py-2 hover:bg-gray-200 text-sm"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSearchResults([]);
                                        setSearchBar(false);
                                    }}
                                >
                                    {result.path}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* ⬇️ Download */}
                <div className="flex space-x-2">
                    <DownloadButton
                        handleDownloadFolder={handleDownloadFolder}
                        isLoading={isLoading}
                        status={status}
                    />
                    <Link to={`/${username}`} className={` px-3 py-2 bg-grey text-white cursor-pointer rounded-xl transition-all duration-300 md:flex hidden justify-center disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-105`}>
                        <img src={avatar} alt="Profile" className="w-6 h-6 rounded-full mr-1 " />
                        Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Header;
