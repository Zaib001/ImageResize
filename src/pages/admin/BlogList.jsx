import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    Plus,
    CheckCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
    AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import blogService from '../../services/blogService';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    const fetchBlogs = async (page = 1) => {
        setIsLoading(true);
        try {
            const params = { page, limit: 10 };
            if (search) params.search = search;
            if (status) params.status = status;

            const response = await blogService.adminGetAllBlogs(params);
            if (response.success) {
                setBlogs(response.data.blogs);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchBlogs(1);
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [search, status]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to terminate this asset? This action is irreversible.')) return;

        try {
            const response = await blogService.adminDeleteBlog(id);
            if (response.success) {
                fetchBlogs(pagination.page);
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await blogService.adminToggleStatus(id);
            if (response.success) {
                fetchBlogs(pagination.page);
            }
        } catch (error) {
            console.error('Toggle status failed:', error);
        }
    };

    return (
        <div className="space-y-10 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-[#F63049] uppercase">
                        Content <span className="opacity-30">Inventory</span>
                    </h1>
                    <p className="text-[#8A244B]/40 text-xs font-bold uppercase tracking-[0.4em] mt-3">
                        Digital Asset Management System
                    </p>
                </div>
                <Link
                    to="/admin/blogs/new"
                    className="flex items-center space-x-2 px-6 py-4 bg-[#F63049] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-[#F63049]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Plus className="w-4 h-4" />
                    <span>Synchronize New Asset</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-[32px] border border-[#F63049]/5 flex flex-col md:flex-row gap-6 shadow-sm">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A244B]/20 group-focus-within:text-[#F63049] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search assets by title or signature..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-[#F63049]/5 border border-transparent rounded-2xl focus:bg-white focus:border-[#F63049]/10 outline-none transition-all text-sm font-medium"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-6 py-3 bg-[#F63049]/5 border border-transparent rounded-2xl outline-none text-[11px] font-black uppercase tracking-widest text-[#8A244B]/60 focus:bg-white focus:border-[#F63049]/10 transition-all cursor-pointer"
                    >
                        <option value="">Status: All Levels</option>
                        <option value="published">Active</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-[40px] border border-[#F63049]/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#F63049]/5">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#8A244B]/30">Asset Identity</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#8A244B]/30">Metrics</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#8A244B]/30">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#8A244B]/30">Date Matrix</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#8A244B]/30 text-right">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F63049]/5">
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i}>
                                        <td colSpan="5" className="px-8 py-6">
                                            <div className="h-10 bg-[#F63049]/5 animate-pulse rounded-xl" />
                                        </td>
                                    </tr>
                                ))
                            ) : blogs.length > 0 ? (
                                blogs.map((blog) => (
                                    <tr key={blog._id} className="hover:bg-[#F63049]/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                {blog.featuredImage ? (
                                                    <img src={blog.featuredImage} className="w-12 h-12 rounded-xl object-cover border border-[#F63049]/5" alt="" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-xl bg-[#F63049]/5 flex items-center justify-center">
                                                        <FileText className="w-5 h-5 text-[#F63049]/20" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="text-sm font-black text-[#F63049] tracking-tight">{blog.title}</h4>
                                                    <p className="text-[10px] font-bold text-[#8A244B]/30 uppercase tracking-widest mt-1">/{blog.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-6">
                                                <div className="flex items-center space-x-2">
                                                    <Eye className="w-3.5 h-3.5 text-[#8A244B]/20" />
                                                    <span className="text-[11px] font-black text-[#F63049]">{blog.viewCount}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="w-3.5 h-3.5 text-[#8A244B]/20" />
                                                    <span className="text-[11px] font-black text-[#F63049]">{blog.readTime}m</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button
                                                onClick={() => handleToggleStatus(blog._id)}
                                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${blog.status === 'published'
                                                    ? 'bg-[#F63049]/10 text-[#F63049] hover:bg-[#F63049]/20'
                                                    : 'bg-[#8A244B]/5 text-[#8A244B]/50 hover:bg-[#8A244B]/10'
                                                    }`}
                                            >
                                                {blog.status}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-[10px] font-bold text-[#8A244B]/60 uppercase tracking-widest leading-none">
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-[8px] font-medium text-[#8A244B]/20 uppercase tracking-widest mt-1">Initialized</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end space-x-3">
                                                <Link
                                                    to={`/admin/blogs/edit/${blog._id}`}
                                                    className="p-2.5 bg-[#F63049]/5 text-[#F63049] hover:bg-[#F63049] hover:text-white rounded-xl transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(blog._id)}
                                                    className="p-2.5 bg-[#8A244B]/5 text-[#8A244B]/40 hover:bg-black hover:text-white rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <AlertCircle className="w-12 h-12 text-[#8A244B]/10 mx-auto mb-4" />
                                        <p className="text-[#8A244B]/30 text-[10px] font-black uppercase tracking-widest">No assets synchronized in the matrix</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-6">
                    <button
                        disabled={pagination.page === 1}
                        onClick={() => fetchBlogs(pagination.page - 1)}
                        className="p-3 bg-white border border-[#F63049]/5 rounded-xl text-[#F63049] disabled:opacity-20 hover:scale-110 active:scale-90 transition-all shadow-sm"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-[11px] font-black uppercase tracking-widest text-[#8A244B]/40">
                        Matrix <span className="text-[#F63049]">{pagination.page}</span> / {pagination.pages}
                    </div>
                    <button
                        disabled={pagination.page === pagination.pages}
                        onClick={() => fetchBlogs(pagination.page + 1)}
                        className="p-3 bg-white border border-[#F63049]/5 rounded-xl text-[#F63049] disabled:opacity-20 hover:scale-110 active:scale-90 transition-all shadow-sm"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default BlogList;
