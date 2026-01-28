import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    ArrowRight,
    Clock,
    Calendar,
    Tag,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import blogService from '../services/blogService';
import SEOHead from '../components/SEOHead';
import Navbar from '../components/Navbar';

const BlogListPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [categories, setCategories] = useState(['All']);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [blogRes, catRes] = await Promise.all([
                    blogService.getPublishedBlogs({ category: activeCategory !== 'All' ? activeCategory : undefined, search }),
                    blogService.getCategories()
                ]);

                if (blogRes.success) setBlogs(blogRes.data.blogs);
                if (catRes.success) setCategories(['All', ...catRes.data]);
            } catch (error) {
                console.error('Failed to fetch public blogs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const delay = setTimeout(fetchData, 400);
        return () => clearTimeout(delay);
    }, [activeCategory, search]);

    return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#8A244B] font-sans overflow-x-hidden pt-24">
            <SEOHead
                title="Resources & Insights"
                description="Expert imaging strategies, neural upscaling insights, and enterprise-grade asset management workflows."
                slug="/blog"
            />

            <div className="noise-overlay" />

            {/* Mesh Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="premium-blur top-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#F63049] opacity-[0.03]" />
                <div className="premium-blur bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#D02752] opacity-[0.02]" />
            </div>

            <Navbar />

            {/* Hero Section */}
            <section className="relative px-8 pt-24 pb-16 text-center overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-[1000px] mx-auto space-y-8"
                >
                    <div className="inline-flex items-center space-x-3 px-6 py-2 rounded-full bg-[#F63049]/5 border border-[#F63049]/10 backdrop-blur-md mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F63049] animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.3rem] uppercase text-[#F63049]/80">The Knowledge Matrix</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#F63049] uppercase leading-[0.9]">
                        Insights <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F63049] to-[#D02752]">&</span> Strategies.
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#8A244B]/60 font-medium leading-relaxed">
                        Exploration of digital asset synthesis, neural upscaling, <br className="hidden md:block" />
                        and precision imaging for the modern enterprise.
                    </p>
                </motion.div>

                {/* Search & Filter Bar */}
                <div className="max-w-[800px] mx-auto mt-20 space-y-8 relative z-10">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-[#8A244B]/20 group-focus-within:text-[#F63049] transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search the archive..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-16 pr-8 py-6 bg-white/50 backdrop-blur-2xl border border-[#F63049]/10 rounded-[32px] focus:bg-white focus:ring-4 focus:ring-[#F63049]/5 outline-none transition-all text-sm font-medium shadow-sm"
                        />
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeCategory === cat
                                    ? 'bg-[#F63049] text-white shadow-lg shadow-[#F63049]/20 translate-y-[-2px]'
                                    : 'bg-[#F63049]/5 text-[#8A244B]/40 hover:bg-[#F63049]/10'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="px-8 pb-32 max-w-[1400px] mx-auto min-h-[400px]">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[450px] bg-[#F63049]/[0.02] animate-pulse rounded-[40px] border border-[#F63049]/5" />
                        ))}
                    </div>
                ) : blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-12">
                        <AnimatePresence mode="popLayout">
                            {blogs.map((blog, i) => (
                                <motion.div
                                    key={blog._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative"
                                >
                                    <Link to={`/blog/${blog.slug}`} className="block h-full">
                                        <div className="glass-card h-full rounded-[40px] overflow-hidden border border-[#F63049]/5 group-hover:border-[#F63049]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#F63049]/5 group-hover:-translate-y-2">
                                            {/* Image container */}
                                            <div className="relative h-64 overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                                                <img
                                                    src={blog.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80'}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                />
                                                <div className="absolute top-6 left-6 z-20">
                                                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest text-[#F63049] shadow-sm">
                                                        {blog.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content container */}
                                            <div className="p-8 space-y-6">
                                                <div className="flex items-center space-x-6 text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A244B]/30">
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{new Date(blog.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{blog.readTime}m Min Sync</span>
                                                    </div>
                                                </div>

                                                <h3 className="text-2xl font-black tracking-tighter text-[#F63049] leading-tight group-hover:text-[#D02752] transition-colors">
                                                    {blog.title}
                                                </h3>

                                                <p className="text-[#8A244B]/60 text-sm leading-relaxed line-clamp-3 font-medium">
                                                    {blog.excerpt || 'Delving into the complexities of neural architecture and precision imaging strategies...'}
                                                </p>

                                                <div className="pt-4 flex items-center text-[#F63049] text-[10px] font-black uppercase tracking-[0.3em] group/btn">
                                                    <span>Decipher Node</span>
                                                    <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-40 bg-[#F63049]/[0.02] rounded-[48px] border-2 border-dashed border-[#F63049]/10 mt-12">
                        <Loader2 className="w-12 h-12 text-[#F63049]/10 mx-auto mb-6" />
                        <h3 className="text-xl font-black uppercase tracking-tight text-[#8A244B]/30">Archive Entry Not Found</h3>
                        <p className="text-[#8A244B]/20 text-xs font-bold uppercase tracking-widest mt-2">Adjust search parameters in the matrix</p>
                    </div>
                )}
            </section>



            {/* Footer */}
            <footer className="py-24 px-8 border-t border-[#F63049]/5">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <span className="text-2xl font-black tracking-tighter uppercase text-[#F63049]">RESIZELY</span>
                        <p className="text-[10px] font-bold tracking-[0.3em] text-[#8A244B]/30 uppercase">Knowledge Matrix Division</p>
                    </div>
                    <p className="text-[10px] font-black tracking-[0.2em] text-[#8A244B]/10 uppercase">
                        RESIZELY TECHNOLOGY GROUP © 2026
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default BlogListPage;
