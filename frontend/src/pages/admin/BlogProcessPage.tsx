import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import { API_BASE_URL } from "../../config/api";

const BlogProcessPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { session, logout } = useAuth();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        author: 'Travores Team',
        published: true,
    });
    const [image, setImage] = useState<File | null>(null);
    const [currentImage, setCurrentImage] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getImageUrl = (url?: string): string => {
        if (!url) return '';
        if (url.startsWith("http")) return url;
        const cleanBase = API_BASE_URL.replace(/\/$/, "");
        const cleanUrl = url.replace(/^\/+/, "");
        return `${cleanBase}/${cleanUrl}`;
    };

    useEffect(() => {
        if (isEditMode && session) {
            fetchBlog();
        }
    }, [id, session]);

    const fetchBlog = async () => {
        try {
            if (!session?.access_token) return;
            // Actually, let's try to fetch all admin blogs and find it? Inefficient but works for now.
            const allResponse = await axios.get('/api/blogs/admin/all', { headers: { Authorization: `Bearer ${session.access_token}` } });
            const found = allResponse.data.find((b: any) => b.id === id);
            if (found) {
                setFormData({
                    title: found.title,
                    slug: found.slug,
                    content: found.content,
                    author: found.author,
                    published: found.published
                });
                setCurrentImage(found.image);
            }
        } catch (err) {
            console.error('Error fetching blog details');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from title if slug is empty
        if (name === 'title' && !isEditMode) {
            setFormData(prev => ({ ...prev, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!session?.access_token) {
                setError('You must be logged in');
                return;
            }

            const data = new FormData();
            data.append('title', formData.title);
            data.append('slug', formData.slug);
            data.append('content', formData.content);
            data.append('author', formData.author);
            data.append('published', String(formData.published));
            if (image) {
                data.append('image', image);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${session.access_token}`
                }
            };

            if (isEditMode) {
                await axios.put(`/api/blogs/${id}`, data, config);
            } else {
                await axios.post('/api/blogs', data, config);
            }

            navigate('/admin/blogs');
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                logout();
                return;
            }
            setError(err.response?.data?.error || 'Error saving blog');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <button onClick={() => navigate('/admin/blogs')} className="text-gray-500 hover:text-gray-700">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Blog' : 'Create New Blog'}</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                placeholder="e.g., Top 10 Hidden Gems in Bali"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all bg-gray-50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                        {currentImage && !image && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                                <img src={getImageUrl(currentImage)} alt="Current" className="h-32 rounded-lg object-cover" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML Supported)</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={15}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all font-mono text-sm"
                            placeholder="<p>Write your amazing story here...</p>"
                        />
                        <p className="text-xs text-gray-500 mt-1">Basic HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;strong&gt; are supported for formatting.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            />
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-900 font-medium">Publish Immediately</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/blogs')}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-travores-green text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (isEditMode ? 'Update Blog' : 'Create Blog')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogProcessPage;
