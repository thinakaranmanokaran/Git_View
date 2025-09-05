import { IoArrowForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AuroraBackground } from "../../components/global/Background";
import { MdClear } from "react-icons/md";

const Hero = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Debounce logic
    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    // Fetch GitHub users
    const fetchUsers = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }
        try {
            setLoading(true);
            setError("");
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/search/users?q=${searchQuery}`,
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
                    },
                }
            );
            setResults(res.data.items || []);
        } catch (err) {
            setError("Failed to fetch users. Try again.");
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search function
    const debouncedSearch = useCallback(debounce(fetchUsers, 500), []);

    // Watch query changes
    useEffect(() => {
        if (query) {
            debouncedSearch(query);
        } else {
            setResults([]);
        }
    }, [query]);

    const handleSelectUser = (username) => {
        navigate(`/${username}`);
        setQuery("");
        setResults([]);
    };

    const handleClear = () => {
        setQuery("");
        setResults([]);
    };

    return (
        <div className="scrollbar-none overflow-y-hidden">
            <AuroraBackground>
                <motion.div
                    initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="relative  flex flex-col gap-4 items-center justify-center px-4"
                >
                    <div className="flex justify-center items-center h-screen bg-cover bg-center">
                        <div className="flex flex-col items-center text-center space-y-8 relative z-10 animate-fade-in">
                            <div className="space-y-3">
                                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter max-w-3xl mx-auto">
                                    A{" "}
                                    <span className="bg-gradient-to-r from-[#2463EB] to-[#5D2DE6] bg-clip-text text-transparent pr-1">
                                        smarter way
                                    </span>{" "}
                                    to browse your GitHub repos
                                </h1>
                                <p className="text-lg md:text-lg mt-6 text-[#64748B] max-w-[700px] mx-auto font-general">
                                    Git View gives you a minimalist, beautiful interface to explore repositories, branches, and code with ease.
                                </p>
                            </div>

                            {/* Search Box */}
                            <div className="relative w-full max-w-md font-general">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && results.length > 0) {
                                            handleSelectUser(results[0].login);
                                        }
                                    }}
                                    // when it has a value just w-full otherwise max-w-sm
                                    className={`w-full h-full px-8 py-4 ${query ? "max-w-full" : "max-w-sm"} focus:max-w-full transition-all duration-300 ease-in-out rounded-full border border-black focus:outline-none`}
                                    placeholder="Search GitHub username..."
                                />
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-gray-200 rounded-full border-t-black animate-spin absolute top-1/2 right-4 transform -translate-y-1/2" />
                                ) : (
                                    query && (
                                        <button
                                            onClick={handleClear}
                                            className="absolute right-4 top-1/2 cursor-pointer transform -translate-y-1/2 text-gray-500 hover:text-black"
                                        >
                                            <MdClear size={20} />
                                        </button>
                                    )
                                )}
                                {/* Dropdown results */}
                                {results.length > 0 && (
                                    <ul className="absolute left-0 right-0 mt-2 bg-white border py-2 border-gray-200 rounded-2xl shadow-lg max-h-80 overflow-y-auto z-20">
                                        {/* Show five results */}
                                        {results.slice(0, 5).map((user) => (
                                            <li
                                                key={user.id}
                                                onClick={() => handleSelectUser(user.login)}
                                                className="flex items-center gap-3 px-4 py-2 cursor-pointer transition group hover:bg-gray-100"
                                            >
                                                <img
                                                    src={user.avatar_url}
                                                    alt={user.login}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <span className="text-sm font-medium">{user.login}</span>
                                                <IoArrowForward className="ml-auto group-hover:translate-x-2 transition-transform duration-200 text-gray-400" />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Loading / Error */}
                            {/* {loading && <p className="text-gray-500">Searching...</p>} */}
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </div>
                    </div>
                </motion.div>
            </AuroraBackground>
        </div>
    );
};

export default Hero;
