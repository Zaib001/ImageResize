import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    Calendar,
    ChevronLeft,
    Share2,
    Bookmark,
    ArrowRight,
    Tag,
    User,
    Loader2,
    Check
} from 'lucide-react';
import blogService from '../services/blogService';
import SEOHead from '../components/SEOHead';
import Navbar from '../components/Navbar';

const BlogDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [shareStatus, setShareStatus] = useState(null); // 'sharing' | 'copied' | null

    useEffect(() => {
        if (blog) {
            const savedNodes = JSON.parse(localStorage.getItem('saved_nodes') || '[]');
            setIsSaved(savedNodes.some(node => node.id === blog._id));
        }
    }, [blog]);

    const handleShare = async () => {
        const shareData = {
            title: blog.title,
            text: blog.excerpt,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setShareStatus('copied');
                setTimeout(() => setShareStatus(null), 2000);
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error sharing:', err);
            }
        }
    };

    const handleSave = () => {
        const savedNodes = JSON.parse(localStorage.getItem('saved_nodes') || '[]');
        let updatedNodes;

        if (isSaved) {
            updatedNodes = savedNodes.filter(node => node.id !== blog._id);
            setIsSaved(false);
        } else {
            updatedNodes = [...savedNodes, {
                id: blog._id,
                title: blog.title,
                slug: blog.slug,
                image: blog.featuredImage,
                date: blog.publishedAt
            }];
            setIsSaved(true);
        }

        localStorage.setItem('saved_nodes', JSON.stringify(updatedNodes));
    };

    useEffect(() => {
        const fetchBlogData = async () => {
            setIsLoading(true);
            try {
                const response = await blogService.getBlogBySlug(slug);
                if (response.success) {
                    setBlog(response.data);

                    // Fetch related blogs based on slug
                    const relatedRes = await blogService.getRelatedBlogs(response.data.slug);
                    if (relatedRes.success) {
                        setRelatedBlogs(relatedRes.data);
                    }
                } else {
                    navigate('/blog');
                }
            } catch (error) {
                console.error('Failed to fetch blog detail:', error);
                navigate('/blog');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogData();
        window.scrollTo(0, 0);
    }, [slug, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-6">
                <Loader2 className="w-12 h-12 text-[#F63049] animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8A244B]/30">Synchronizing Data Matrix...</p>
            </div>
        );
    }

    if (!blog) return null;

    const blogActions = (
        <div className="flex items-center space-x-6">
            <Link to="/blog" className="flex items-center space-x-3 text-[#8A244B]/40 hover:text-[#F63049] transition-all group mr-4">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return</span>
            </Link>
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className={`flex items-center space-x-2 transition-colors ${shareStatus === 'copied' ? 'text-[#F63049]' : 'text-[#8A244B]/30 hover:text-[#F63049]'}`}
            >
                <AnimatePresence mode="wait">
                    {shareStatus === 'copied' ? (
                        <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center space-x-2"
                        >
                            <Check className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Copied</span>
                        </motion.div>
                    ) : (
                        <Share2 className="w-4 h-4" />
                    )}
                </AnimatePresence>
            </motion.button>
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSave}
                className={`transition-colors ${isSaved ? 'text-[#F63049]' : 'text-[#8A244B]/30 hover:text-[#F63049]'}`}
            >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </motion.button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#8A244B] font-sans pb-32 overflow-x-hidden pt-24">
            <SEOHead
                title={blog.metaTitle || blog.title}
                description={blog.metaDescription || blog.excerpt}
                slug={`/blog/${blog.slug}`}
                image={blog.featuredImage}
                article={true}
            />

            <div className="noise-overlay" />

            {/* Mesh Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="premium-blur top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#F63049] opacity-[0.02]" />
                <div className="premium-blur bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-[#D02752] opacity-[0.015]" />
            </div>

            {/* Post Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-[#F63049] z-[110] origin-left"
                initial={{ scaleX: 0 }}
                style={{ scaleX: 0 }} // Will be controlled by scroll in a real app
            />

            <Navbar extraActions={blogActions} />

            <article className="max-w-[1000px] mx-auto px-8 mt-12 md:mt-24">
                {/* Post Header */}
                <header className="space-y-12 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-6 justify-center md:justify-start">
                        <span className="px-4 py-1.5 bg-[#F63049]/5 border border-[#F63049]/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#F63049] w-fit mx-auto md:mx-0">
                            {blog.category}
                        </span>
                        <div className="flex items-center justify-center md:justify-start space-x-6 text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A244B]/30">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(blog.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{blog.readTime}m Min Sync</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-[#F63049] uppercase leading-[0.9] max-w-4xl">
                        {blog.title}
                    </h1>

                    <div className="flex items-center justify-center md:justify-start space-x-4 pt-4">
                        <div className="w-12 h-12 bg-[#F63049]/5 border border-[#F63049]/10 rounded-2xl flex items-center justify-center">
                            <User className="w-6 h-6 text-[#F63049]" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#F63049]">Resizely Core Staff</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#8A244B]/30 mt-0.5">Imaging Specialist</p>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-16 md:mt-24 relative rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl shadow-[#F63049]/5 border border-[#F63049]/5"
                >
                    <img
                        src={blog.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80'}
                        alt={blog.title}
                        className="w-full h-[300px] md:h-[600px] object-cover"
                    />
                </motion.div>

                {/* Content */}
                <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <div
                            className="blog-content prose prose-berry max-w-none text-[#8A244B]/80 leading-[1.8] font-medium text-lg"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />

                        {/* Tags */}
                        <div className="mt-20 pt-10 border-t border-[#F63049]/5 flex flex-wrap gap-3">
                            {blog.tags.map(tag => (
                                <Link
                                    key={tag}
                                    to={`/blog?search=${tag}`}
                                    className="flex items-center space-x-2 px-4 py-2 bg-[#F63049]/5 hover:bg-[#F63049]/10 rounded-xl transition-all"
                                >
                                    <Tag className="w-3 h-3 text-[#F63049]/30" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/60">{tag}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar / Reading Tools */}
                    <aside className="lg:col-span-4 space-y-12">
                        <div className="sticky top-12 space-y-12">
                            <div className="p-8 bg-[#F63049]/5 rounded-[40px] border border-[#F63049]/10">
                                <h4 className="text-[10px] font-black uppercase tracking-[.3em] text-[#F63049] mb-6 underline decoration-[#F63049]/20 underline-offset-8">Key Insights</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-start space-x-3">
                                        <div className="w-1.5 h-1.5 bg-[#F63049] rounded-full mt-1.5" />
                                        <p className="text-[11px] font-bold text-[#8A244B]/70 leading-relaxed uppercase tracking-wider">Neural precision workflows</p>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <div className="w-1.5 h-1.5 bg-[#F63049] rounded-full mt-1.5" />
                                        <p className="text-[11px] font-bold text-[#8A244B]/70 leading-relaxed uppercase tracking-wider">Enterprise asset scaling</p>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-[#8A244B] rounded-[40px] p-8 text-white relative overflow-hidden">
                                <div className="absolute top-[-20%] right-[-20%] w-[120px] h-[120px] bg-white opacity-[0.05] rounded-full blur-2xl" />
                                <h3 className="text-sm font-black uppercase tracking-widest mb-4">Precision Engine</h3>
                                <p className="text-white/50 text-xs leading-relaxed mb-6 font-medium">Ready to deploy these insights to your own assets? Start resizing now.</p>
                                <Link to="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white hover:text-[#F63049] transition-colors">
                                    Launch Accelerator <ArrowRight className="w-3.5 h-3.5 ml-2" />
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </article>

            {/* Related Posts */}
            {relatedBlogs.length > 0 && (
                <section className="max-w-[1400px] mx-auto px-8 mt-40">
                    <div className="flex items-center justify-between mb-16 border-b border-[#F63049]/5 pb-8">
                        <h2 className="text-3xl font-black tracking-tighter text-[#F63049] uppercase">Related <span className="opacity-30">Nodes</span></h2>
                        <Link to="/blog" className="text-[10px] font-black uppercase tracking-widest text-[#F63049] hover:underline underline-offset-4">Browse Archive</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {relatedBlogs.map((item) => (
                            <Link key={item._id} to={`/blog/${item.slug}`} className="group">
                                <div className="space-y-6">
                                    <div className="aspect-[4/3] rounded-[32px] overflow-hidden border border-[#F63049]/5">
                                        <img
                                            src={item.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80'}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#8A244B]/30">{item.category}</span>
                                        <h3 className="text-lg font-black text-[#F63049] tracking-tight group-hover:text-[#D02752] transition-colors leading-tight">{item.title}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default BlogDetailPage;
