import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Eye,
    CheckCircle,
    Clock,
    TrendingUp,
    ArrowUpRight,
    Plus,
    Calendar,
    BarChart3,
    Terminal,
    Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import blogService from '../../services/blogService';
import adminService from '../../services/adminService';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalBlogs: 0,
        publishedBlogs: 0,
        draftBlogs: 0,
        totalViews: 0,
        recentBlogs: [],
        graphData: {
            categories: [],
            growth: []
        }
    });
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, logsRes] = await Promise.all([
                blogService.adminGetStats(),
                adminService.getLogs()
            ]);

            if (statsRes.success) setStats(statsRes.data);
            if (logsRes.success) setLogs(logsRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Set up poll for logs
        const interval = setInterval(() => {
            adminService.getLogs().then(res => {
                if (res.success) setLogs(res.data);
            });
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    const statCards = [
        { label: 'Total Content', value: stats.totalBlogs, icon: FileText, color: '#F63049', bg: 'bg-[#F63049]/5' },
        { label: 'Cloud Reach', value: stats.totalViews, icon: Eye, color: '#D02752', bg: 'bg-[#D02752]/5' },
        { label: 'Active Nodes', value: stats.publishedBlogs, icon: CheckCircle, color: '#8A244B', bg: 'bg-[#8A244B]/5' },
        { label: 'Draft Assets', value: stats.draftBlogs, icon: Clock, color: '#F63049', bg: 'bg-[#F63049]/5' },
    ];

    if (isLoading) {
        return (
            <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 rounded-[32px] bg-white animate-pulse" />
                    ))}
                </div>
                <div className="h-[400px] rounded-[40px] bg-white animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-[#F63049] uppercase">
                        System <span className="opacity-30">Overview</span>
                    </h1>
                    <p className="text-[#8A244B]/40 text-xs font-bold uppercase tracking-[0.4em] mt-3">
                        Operational Intelligence Interface
                    </p>
                </div>
                <Link
                    to="/admin/blogs/new"
                    className="flex items-center space-x-2 px-6 py-4 bg-[#F63049] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-[#F63049]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Asset</span>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[32px] border border-[#F63049]/5 hover:border-[#F63049]/10 transition-all group relative overflow-hidden"
                    >
                        <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center mb-6 border border-[#F63049]/5 group-hover:scale-110 transition-transform`}>
                            <card.icon className="w-7 h-7" style={{ color: card.color }} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A244B]/30 mb-2">{card.label}</p>
                        <h3 className="text-3xl font-black tracking-tighter text-[#F63049]">{card.value}</h3>
                        <div className="absolute top-8 right-8 text-[#8A244B]/10 group-hover:text-[#F63049]/10 transition-colors">
                            <TrendingUp className="w-12 h-12" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Dashboard Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Visualisation Panel */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-8 bg-white rounded-[40px] border border-[#F63049]/5 p-10 relative overflow-hidden shadow-sm flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-1.5 h-6 bg-[#F63049] rounded-full" />
                            <h2 className="text-xl font-black tracking-tight text-[#F63049] uppercase">Content Velocity</h2>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-2 bg-[#F63049]/5 rounded-xl">
                            <Zap className="w-3 h-3 text-[#F63049]" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#F63049]">Real-time Tracking</span>
                        </div>
                    </div>

                    <div className="h-[320px] w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.graphData.growth.length > 0 ? stats.graphData.growth : [{ name: '01-01', value: 0 }]}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F63049" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#F63049" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F6304910" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 9, fontWeight: 900, fill: '#8A244B40' }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 9, fontWeight: 900, fill: '#8A244B40' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '20px',
                                        border: 'none',
                                        boxShadow: '0 20px 40px -10px rgba(246, 48, 73, 0.15)',
                                        fontSize: '10px',
                                        fontWeight: 900,
                                        textTransform: 'uppercase'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#F63049"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Right Panel/Terminal Logs */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="bg-white rounded-[40px] border border-[#F63049]/5 p-10 overflow-hidden shadow-sm flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8A244B]/30 underline decoration-[#F63049]/20 underline-offset-8">Terminal Logs</h3>
                            <Terminal className="w-4 h-4 text-[#F63049]/20" />
                        </div>

                        <div className="flex-1 space-y-6 overflow-y-auto max-h-[400px] no-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {logs.length > 0 ? (
                                    logs.map((log, i) => (
                                        <motion.div
                                            key={log._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-start space-x-4 group"
                                        >
                                            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${log.type === 'success' ? 'bg-green-500' :
                                                    log.type === 'warning' ? 'bg-orange-500' :
                                                        log.type === 'error' ? 'bg-[#F63049]' : 'bg-blue-500'
                                                }`} />
                                            <div>
                                                <p className="text-[11px] font-bold text-[#8A244B] leading-tight group-hover:text-[#F63049] transition-colors">{log.description}</p>
                                                <div className="flex items-center space-x-2 mt-1.5">
                                                    <p className="text-[8px] font-black text-[#8A244B]/20 uppercase tracking-widest">
                                                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <span className="w-0.5 h-0.5 rounded-full bg-[#8A244B]/10" />
                                                    <p className="text-[8px] font-black text-[#F63049]/40 uppercase tracking-widest">{log.admin?.name || 'SYSTEM'}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4 py-20">
                                        <Terminal className="w-8 h-8" />
                                        <p className="text-[9px] font-black uppercase tracking-widest">Awaiting system events...</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-8 pt-8 border-t border-[#F63049]/5">
                            <Link
                                to="/admin/blogs"
                                className="w-full py-4 bg-[#F63049]/5 text-[#F63049] rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center space-x-2 hover:bg-[#F63049]/10 transition-all"
                            >
                                <span>Audit Records</span>
                                <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inventroy Context */}
            <div className="bg-white rounded-[40px] border border-[#F63049]/5 p-10 relative overflow-hidden shadow-sm">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center space-x-4">
                        <div className="w-1.5 h-6 bg-[#8A244B] rounded-full" />
                        <h2 className="text-xl font-black tracking-tight text-[#8A244B] uppercase">Node Inventory</h2>
                    </div>
                    <Link to="/admin/blogs" className="text-[10px] font-black uppercase tracking-widest text-[#F63049] hover:underline">
                        Secure Directory
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.recentBlogs.slice(0, 3).map((blog, i) => (
                        <Link
                            key={blog._id}
                            to={`/admin/blogs/edit/${blog._id}`}
                            className="p-6 rounded-[32px] bg-[#F63049]/[0.02] border border-[#F63049]/5 hover:border-[#F63049]/20 hover:bg-white transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${blog.status === 'published' ? 'bg-[#F63049]/10 text-[#F63049]' : 'bg-[#8A244B]/10 text-[#8A244B]'
                                    }`}>
                                    {blog.status}
                                </div>
                                <span className="text-[10px] font-black text-[#8A244B]/20">#{i + 1}</span>
                            </div>
                            <h4 className="font-black text-[#F63049] text-sm tracking-tight mb-4 line-clamp-1">{blog.title}</h4>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-[9px] font-bold text-[#8A244B]/30 uppercase tracking-widest">
                                    <Clock className="w-3 h-3" />
                                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-[#F63049]">
                                    <Eye className="w-3 h-3" />
                                    <span className="text-[10px] font-black">{blog.viewCount}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
