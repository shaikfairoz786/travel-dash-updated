import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { PlusIcon, PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Blog {
    id: string;
    title: string;
    slug: string;
    author: string;
    published: boolean;
    createdAt: string;
}

const AdminBlogsPage: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    const { session, logout } = useAuth();

    useEffect(() => {
        if (session) {
            fetchBlogs();
        }
    }, [session]);

    const fetchBlogs = async () => {
        try {
            if (!session?.access_token) return;

            const response = await axios.get('/api/blogs/admin/all', {
                headers: { Authorization: `Bearer ${session.access_token}` }
            });
            setBlogs(response.data);
            setLoading(false);
        } catch (error: any) {
            console.error('Error fetching blogs:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                logout();
            }
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;

        try {
            if (!session?.access_token) return;

            await axios.delete(`/api/blogs/${id}`, {
                headers: { Authorization: `Bearer ${session.access_token}` }
            });
            fetchBlogs();
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete blog');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading blogs...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Manage Blogs</h1>
                <Link
                    to="/admin/blogs/add"
                    className="flex items-center gap-2 bg-travores-green text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add New Blog
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {blogs.map((blog) => (
                            <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                                    <div className="text-xs text-gray-500">/{blog.slug}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {blog.author}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${blog.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {blog.published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-3">
                                        <Link to={`/blogs/${blog.slug}`} target="_blank" className="text-blue-600 hover:text-blue-900" title="View">
                                            <EyeIcon className="w-5 h-5" />
                                        </Link>
                                        <Link to={`/admin/blogs/edit/${blog.id}`} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </Link>
                                        <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:text-red-900" title="Delete">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {blogs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No blogs found. Start writing your first story!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBlogsPage;
