import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Save,
    Eye,
    Image as ImageIcon,
    Tag,
    Layout,
    Globe,
    Clock,
    CheckCircle,
    Loader2,
    X
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import blogService from '../../services/blogService';

const BlogForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [isLoading, setIsLoading] = useState(isEdit);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        metaTitle: '',
        metaDescription: '',
        featuredImage: '',
        category: 'Resources',
        tags: [],
        status: 'draft'
    });
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (isEdit) {
            const fetchBlog = async () => {
                try {
                    const response = await blogService.adminGetBlogById(id);
                    if (response.success) {
                        setFormData(response.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch blog:', error);
                    navigate('/admin/blogs');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchBlog();
        }
    }, [id, isEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from title during creation
        if (name === 'title' && !isEdit) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, tagInput.trim()]
                }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            let response;
            if (isEdit) {
                response = await blogService.adminUpdateBlog(id, formData);
            } else {
                response = await blogService.adminCreateBlog(formData);
            }

            if (response.success) {
                navigate('/admin/blogs');
            }
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'code-block'],
            ['clean']
        ]
    };

    if (isLoading) {
        return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#F63049]" /></div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12 pb-24">
            {/* Header / Submenu */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Link to="/admin/blogs" className="flex items-center space-x-2 text-[#8A244B]/40 hover:text-[#F63049] transition-colors mb-4 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Inventory Level</span>
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight text-[#F63049] uppercase">
                        Asset <span className="opacity-30">{isEdit ? 'Synthesis' : 'Initialisation'}</span>
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/blogs')}
                        className="px-6 py-4 bg-white border border-[#F63049]/5 text-[#8A244B]/40 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#F63049]/5 transition-all"
                    >
                        Abort
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center space-x-2 px-8 py-4 bg-[#F63049] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-[#F63049]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>{isEdit ? 'Finalize Asset' : 'Commit to Matrix'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Primary Data */}
                    <div className="bg-white p-10 rounded-[40px] border border-[#F63049]/5 shadow-sm space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/40 ml-4">Node Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                placeholder="Quantum Resilience in Large Language Models"
                                className="w-full px-8 py-4 bg-[#F63049]/5 border border-transparent rounded-[24px] focus:bg-white focus:border-[#F63049]/20 outline-none transition-all text-lg font-black text-[#F63049]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/40 ml-4">Content Stream</label>
                            <div className="quill-container border border-[#F63049]/5 rounded-[32px] overflow-hidden">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                                    modules={quillModules}
                                    className="bg-white min-h-[400px]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/40 ml-4">Brief Synopsis (Excerpt)</label>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="A concise summary of the digital asset's core purpose..."
                                className="w-full px-8 py-4 bg-[#F63049]/5 border border-transparent rounded-[24px] focus:bg-white focus:border-[#F63049]/20 outline-none transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    {/* SEO / Meta Matrix */}
                    <div className="bg-white p-10 rounded-[40px] border border-[#F63049]/5 shadow-sm space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                            <Globe className="w-32 h-32 text-[#F63049]" />
                        </div>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-1 h-5 bg-[#F63049] rounded-full" />
                            <h3 className="text-xl font-black tracking-tight text-[#F63049] uppercase">Search Optimisation Matrix</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/40 ml-4">Meta Signature (Title)</label>
                                <input
                                    type="text"
                                    name="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={handleInputChange}
                                    maxLength="60"
                                    placeholder="SEO Optimized Signature"
                                    className="w-full px-6 py-4 bg-[#F63049]/5 border border-transparent rounded-2xl focus:bg-white focus:border-[#F63049]/20 outline-none transition-all text-sm"
                                />
                                <div className="flex justify-end pr-4 text-[9px] font-bold text-[#8A244B]/20">
                                    {formData.metaTitle.length}/60
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/40 ml-4">UR-Link Signature (Slug)</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    placeholder="url-friendly-slug"
                                    className="w-full px-6 py-4 bg-[#F63049]/5 border border-transparent rounded-2xl focus:bg-white focus:border-[#F63049]/20 outline-none transition-all text-sm font-mono lowercase"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/40 ml-4">Meta Descriptor</label>
                            <textarea
                                name="metaDescription"
                                value={formData.metaDescription}
                                onChange={handleInputChange}
                                maxLength="160"
                                rows="3"
                                placeholder="Engineered description for search algorithms..."
                                className="w-full px-6 py-4 bg-[#F63049]/5 border border-transparent rounded-2xl focus:bg-white focus:border-[#F63049]/20 outline-none transition-all text-sm"
                            />
                            <div className="flex justify-end pr-4 text-[9px] font-bold text-[#8A244B]/20">
                                {formData.metaDescription.length}/160
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Status & Actions */}
                    <div className="bg-white p-8 rounded-[40px] border border-[#F63049]/5 shadow-sm space-y-8">
                        <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-[#F63049]" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#F63049]">Release Status</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, status: 'draft' }))}
                                className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-[.2em] transition-all border ${formData.status === 'draft'
                                    ? 'bg-[#8A244B]/5 border-[#8A244B]/20 text-[#8A244B]'
                                    : 'border-transparent bg-gray-50 text-[#8A244B]/30 hover:bg-gray-100'
                                    }`}
                            >
                                Hold (Draft)
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, status: 'published' }))}
                                className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-[.2em] transition-all border ${formData.status === 'published'
                                    ? 'bg-[#F63049]/5 border-[#F63049]/20 text-[#F63049]'
                                    : 'border-transparent bg-gray-50 text-[#8A244B]/30 hover:bg-gray-100'
                                    }`}
                            >
                                Deploy (Public)
                            </button>
                        </div>
                    </div>

                    {/* Metadata & Tagging */}
                    <div className="bg-[#F63049]/5 p-8 rounded-[40px] border border-[#F63049]/10 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/40 ml-2 flex items-center">
                                    <Layout className="w-3.5 h-3.5 mr-2" /> Sector (Category)
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 bg-white border-none rounded-2xl outline-none text-[11px] font-black uppercase tracking-widest text-[#F63049] shadow-sm"
                                >
                                    <option value="Resources">Resources</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Enterprise">Enterprise</option>
                                    <option value="Synthesis">Synthesis</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/40 ml-2 flex items-center">
                                    <ImageIcon className="w-3.5 h-3.5 mr-2" /> Visual Identity (URL)
                                </label>
                                <input
                                    type="text"
                                    name="featuredImage"
                                    value={formData.featuredImage}
                                    onChange={handleInputChange}
                                    placeholder="https://cloud.storage/asset.jpg"
                                    className="w-full px-6 py-4 bg-white border-none rounded-2xl outline-none text-xs font-medium shadow-sm"
                                />
                                {formData.featuredImage && (
                                    <div className="mt-4 rounded-xl overflow-hidden border-2 border-white shadow-md">
                                        <img src={formData.featuredImage} alt="Preview" className="w-full h-32 object-cover" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/40 ml-2 flex items-center">
                                    <Tag className="w-3.5 h-3.5 mr-2" /> Signature Tags
                                </label>
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder="Add tag and press Enter..."
                                    className="w-full px-6 py-4 bg-white border-none rounded-2xl outline-none text-xs font-medium shadow-sm"
                                />
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map(tag => (
                                        <div key={tag} className="flex items-center bg-[#8A244B] text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                            {tag}
                                            <button type="button" onClick={() => removeTag(tag)} className="ml-2 hover:text-black">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default BlogForm;
