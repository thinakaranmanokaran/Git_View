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
        setSearchBar(!searchBar);
        setSearchQuery("");
        setSearchResults([]);
    };

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
                <DownloadButton
                    handleDownloadFolder={handleDownloadFolder}
                    isLoading={isLoading}
                    status={status}
                />
            </div>
        </div>
    );
};

export default Header;
