import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    UserIcon,
    ArrowLongRightIcon,
    MagnifyingGlassIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

import { API_BASE_URL } from "../config/api";

interface Blog {
    id: string;
    title: string;
    slug: string;
    image: string;
    author: string;
    createdAt: string;
    content: string;
    category?: string; // Optional for now
}

// Mock Categories
const CATEGORIES = ["All Stories", "Destinations", "Food & Culture", "Travel Guides", "Luxury Stays", "Adventure"];

const BlogListPage: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All Stories");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/blogs`);
            setBlogs(response.data.blogs || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setLoading(false);
        }
    };

    const getImageUrl = (url?: string): string => {
        if (!url) return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
        if (url.startsWith("http")) return url;
        const cleanBase = API_BASE_URL.replace(/\/$/, "");
        const cleanUrl = url.replace(/^\/+/, "");
        return `${cleanBase}/${cleanUrl}`;
    };

    const getExcerpt = (html: string, length = 120) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        const text = tmp.textContent || tmp.innerText || "";
        return text.substring(0, length) + '...';
    };

    // Derived state for filtering
    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const featuredStory = filteredBlogs[0]; // First filtered blog is featured
    const gridStories = filteredBlogs.slice(1); // Rest are grid

    return (
        <div className="bg-stone-50 min-h-screen font-sans selection:bg-orange-200">

            {/* Navbar Placeholder/Spacing if needed, assuming global nav exists */}
            <div className="h-20"></div>

            {/* Header & Filter Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 border-b border-stone-200 pb-8">
                    <div>
                        <p className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                            <SparklesIcon className="w-4 h-4" /> The Travel Journal
                        </p>
                        <h1 className="text-5xl md:text-7xl font-black text-stone-900 tracking-tighter">
                            TravelTemplate<span className="text-stone-300">.</span>
                        </h1>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Search stories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-full py-3 pl-12 pr-4 text-stone-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                        />
                        <MagnifyingGlassIcon className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-orange-500 transition-colors" />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mb-8">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${activeCategory === cat
                                ? 'bg-stone-900 text-white border-stone-900 shadow-lg transform scale-105'
                                : 'bg-white text-stone-500 border-stone-200 hover:border-orange-500 hover:text-orange-600'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-stone-900"></div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">

                    {/* Featured Hero Story */}
                    {featuredStory && (
                        <Link to={`/blogs/${featuredStory.slug}`} className="group relative block w-full h-[600px] rounded-[2rem] overflow-hidden mb-16 shadow-2xl">
                            <div className="absolute inset-0 bg-stone-900">
                                <img
                                    src={getImageUrl(featuredStory.image)}
                                    alt={featuredStory.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000 ease-out"
                                />
                            </div>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white">
                                <div className="max-w-3xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-white/10">
                                        Featured Story
                                    </span>
                                    <h2 className="text-4xl md:text-6xl font-black leading-tight mb-6 drop-shadow-lg">
                                        {featuredStory.title}
                                    </h2>
                                    <p className="text-lg md:text-xl text-stone-200 line-clamp-2 md:line-clamp-3 mb-8 font-serif leading-relaxed max-w-2xl">
                                        {getExcerpt(featuredStory.content, 200)}
                                    </p>

                                    <div className="flex items-center gap-2 font-bold text-orange-400 group-hover:text-orange-300 transition-colors">
                                        Read Full Story <ArrowLongRightIcon className="w-6 h-6 ml-2" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Secondary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {gridStories.map((blog) => (
                            <Link
                                to={`/blogs/${blog.slug}`}
                                key={blog.id}
                                className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={getImageUrl(blog.image)}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-stone-800 shadow-sm">
                                        {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-xs font-bold text-orange-600 mb-4 uppercase tracking-wider">
                                        <UserIcon className="w-4 h-4" />
                                        {blog.author || "Editor"}
                                    </div>

                                    <h3 className="text-2xl font-bold text-stone-900 mb-4 leading-tight group-hover:text-orange-600 transition-colors">
                                        {blog.title}
                                    </h3>

                                    <p className="text-stone-500 text-sm leading-relaxed mb-6 font-serif line-clamp-3">
                                        {getExcerpt(blog.content)}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-stone-100 flex justify-between items-center text-sm font-semibold text-stone-900 group-hover:text-orange-600 transition-colors">
                                        <span>Read Story</span>
                                        <ArrowLongRightIcon className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Empty State */}
                    {blogs.length === 0 && (
                        <div className="text-center py-32">
                            <h3 className="text-2xl font-bold text-stone-400">No stories found.</h3>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BlogListPage;
