import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
    CalendarIcon,
    UserIcon,
    ArrowLeftIcon,
    ShareIcon,
    HeartIcon,
    ChatBubbleLeftIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

// Configuration
import { API_BASE_URL } from "../config/api";

interface Blog {
    id: string;
    title: string;
    slug: string;
    image: string;
    author: string;
    createdAt: string;
    content: string;
    readTime?: string; // Optional field
}

const BlogDetailsPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [scrollProgress, setScrollProgress] = useState(0);

    const getImageUrl = (url?: string): string => {
        if (!url) return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
        if (url.startsWith("http")) return url;
        const cleanBase = API_BASE_URL.replace(/\/$/, "");
        const cleanUrl = url.replace(/^\/+/, "");
        return `${cleanBase}/${cleanUrl}`;
    };

    // Scroll Progress Handler
    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;
            setScrollProgress(Number(scroll));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch current blog
                const blogRes = await axios.get(`${API_BASE_URL}/api/blogs/${slug}`);
                setBlog(blogRes.data);

                // 2. Fetch related blogs (latest 4, then filter out current)
                const relatedRes = await axios.get(`${API_BASE_URL}/api/blogs?limit=4`);
                // The API returns { blogs: [...] }, check structure if needed (controller returns { blogs, totalPages... })
                const allBlogs = relatedRes.data.blogs || [];
                const filtered = allBlogs.filter((b: Blog) => b.slug !== slug).slice(0, 3);
                setRelatedBlogs(filtered);

                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch blog data", err);
                setError('Blog post not found.');
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0); // Reset scroll on slug change
    }, [slug]);

    // SEO: Update Page Title
    useEffect(() => {
        if (blog) {
            document.title = `${blog.title} | TravelTemplate Stories`;
        }
    }, [blog]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                <p className="text-gray-500 animate-pulse">Loading story...</p>
            </div>
        </div>
    );

    if (error || !blog) return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">404</h2>
            <p className="text-gray-600 mb-8 text-lg">{error}</p>
            <Link to="/blogs" className="px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                Return to Stories
            </Link>
        </div>
    );

    return (
        <article className="bg-white min-h-screen font-sans selection:bg-yellow-200 selection:text-black">

            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-50">
                <div
                    className="h-full bg-primary-600 transition-all duration-100 ease-out"
                    style={{ width: `${scrollProgress * 100}%` }}
                />
            </div>

            {/* Hero Section with Parallax Effect */}
            <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-75"
                    style={{
                        backgroundImage: `url(${getImageUrl(blog.image)})`,
                        transform: `translateY(${scrollProgress * 100}px)` // Simple parallax
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 text-white">
                    <div className="max-w-4xl mx-auto animate-fade-in-up">
                        <Link to="/blogs" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors text-sm font-semibold tracking-wide uppercase">
                            <ArrowLeftIcon className="w-4 h-4" /> Back to Stories
                        </Link>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 drop-shadow-lg">
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-white/90 font-medium">
                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
                                <UserIcon className="w-4 h-4" />
                                {blog.author || "TravelTemplate Team"}
                            </span>
                            <span className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                {new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-2">
                                <ClockIcon className="w-4 h-4" />
                                {blog.readTime || "5 min read"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col lg:flex-row gap-12">

                {/* Sticky Sidebar (Social + Interactions) */}
                <aside className="lg:w-24 hidden lg:flex flex-col gap-6 sticky top-32 h-fit items-center">
                    <button className="p-3 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-colors group" title="Like">
                        <HeartIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>
                    <button className="p-3 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors group" title="Share on Twitter">
                        <ShareIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>
                    <button className="p-3 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-green-500 transition-colors group" title="Comment">
                        <ChatBubbleLeftIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>
                    <div className="w-px h-12 bg-gray-200 mt-2"></div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 max-w-3xl">
                    <div className="prose prose-lg md:prose-xl prose-stone max-w-none 
                        prose-headings:font-bold prose-headings:text-gray-900 prose-headings:font-sans
                        prose-p:text-gray-700 prose-p:leading-loose prose-p:font-serif
                        prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-3xl prose-img:shadow-xl prose-img:my-10
                        prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic

                        first-letter:text-5xl first-letter:font-bold first-letter:text-primary-600 first-letter:float-left first-letter:mr-3 first-letter:mt-[-4px]"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
                    />

                    {/* CTA Box */}
                    <div className="my-16 bg-gradient-to-br from-primary-50 to-emerald-50 rounded-3xl p-8 md:p-12 border border-primary-100 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-primary-200 rounded-full blur-3xl opacity-50"></div>

                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 relative z-10">Inspired by this story?</h3>
                        <p className="text-gray-600 mb-8 max-w-lg mx-auto relative z-10">
                            Turn your dream into reality. Plan your next adventure with our expert guides and curated packages.
                        </p>
                        <Link to="/packages" className="inline-block px-8 py-4 bg-primary-600 text-white font-bold rounded-full shadow-xl hover:bg-primary-700 hover:shadow-2xl transition-all hover:-translate-y-1 relative z-10">
                            Start Planning Today
                        </Link>
                    </div>

                    {/* Author Bio (Simple) */}
                    <div className="border-t border-b border-gray-100 py-8 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                            <UserIcon className="w-full h-full p-3 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Written By</p>
                            <h4 className="text-lg font-bold text-gray-900">{blog.author || "TravelTemplate Editor"}</h4>
                            <p className="text-sm text-gray-600">Travel enthusiast and storyteller.</p>
                        </div>
                    </div>
                </main>
            </div>

            {/* Read Next Section */}
            <section className="bg-gray-50 py-20 border-t border-gray-200">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-10 text-center">Read Next</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedBlogs.length > 0 ? (
                            relatedBlogs.map(story => (
                                <Link to={`/blogs/${story.slug}`} key={story.id} className="group cursor-pointer">
                                    <div className="rounded-2xl overflow-hidden h-64 mb-4 relative">
                                        <img
                                            src={getImageUrl(story.image)}
                                            alt={story.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">{story.title}</h4>
                                    <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                                        Read Story <ArrowLeftIcon className="w-3 h-3 rotate-180" />
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <p className="col-span-3 text-center text-gray-500 italic">More stories coming soon...</p>
                        )}
                    </div>
                </div>
            </section>
        </article>
    );
};

export default BlogDetailsPage;
