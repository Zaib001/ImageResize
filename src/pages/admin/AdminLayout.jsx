import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    PlusCircle,
    Settings,
    LogOut,
    Menu,
    X,
    User,
    ChevronRight,
    Bell,
    ExternalLink,
    Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Analytics' },
        { path: '/admin/network', icon: Users, label: 'Collective' },
        { path: '/admin/blogs', icon: FileText, label: 'All Blogs' },
        { path: '/admin/blogs/new', icon: PlusCircle, label: 'Create Post' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-[#F9F8F6] text-[#8A244B] font-sans flex overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? '280px' : '88px' }}
                className="bg-white border-r border-[#F63049]/5 flex flex-col z-30 transition-all duration-500 ease-[0.16, 1, 0.3, 1]"
            >
                {/* Logo Section */}
                <div className="p-6 flex items-center h-24 border-b border-[#F63049]/5 overflow-hidden">
                    <div className="min-w-[40px] h-10 bg-[#F63049] rounded-2xl flex items-center justify-center shadow-lg shadow-[#F63049]/20">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                    {isSidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="ml-4 text-xl font-black tracking-tighter text-[#F63049] uppercase whitespace-nowrap"
                        >
                            CORE <span className="opacity-20">ADM</span>
                        </motion.span>
                    )}
                </div>

                {/* Nav Menu */}
                <nav className="flex-1 py-8 px-4 overflow-y-auto no-scrollbar">
                    <div className="space-y-2">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center px-4 py-4 rounded-2xl transition-all duration-300 group relative
                                    ${isActive
                                        ? 'bg-[#F63049] text-white shadow-lg shadow-[#F63049]/20'
                                        : 'hover:bg-[#F63049]/5 text-[#8A244B]/60 hover:text-[#F63049]'}
                                `}
                            >
                                <item.icon className={`w-5 h-5 min-w-[20px] ${isSidebarOpen ? 'mr-4' : 'mx-auto'}`} />
                                {isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-[#F63049]/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-4 rounded-2xl text-[#8A244B]/40 hover:text-[#F63049] hover:bg-[#F63049]/5 transition-all group"
                    >
                        <LogOut className={`w-5 h-5 min-w-[20px] ${isSidebarOpen ? 'mr-4' : 'mx-auto'}`} />
                        {isSidebarOpen && (
                            <span className="text-[11px] font-black uppercase tracking-widest">Terminate Session</span>
                        )}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Header */}
                <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-[#F63049]/5 px-8 flex items-center justify-between z-20">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2.5 bg-[#F63049]/5 text-[#F63049] rounded-xl hover:bg-[#F63049]/10 transition-colors"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <div className="h-4 w-px bg-[#F63049]/10 hidden sm:block" />
                        <div className="hidden sm:flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#8A244B]/40">
                            <span className="text-[#8A244B]/20">Systems</span>
                            <ChevronRight className="w-3 h-3 mx-2 opacity-30" />
                            <span>Dashboard</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <a
                            href="/"
                            target="_blank"
                            className="p-2.5 text-[#8A244B]/40 hover:text-[#F63049] transition-colors relative group"
                        >
                            <ExternalLink className="w-5 h-5" />
                            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                View Site
                            </span>
                        </a>
                        <div className="h-8 w-px bg-[#F63049]/10" />
                        <div className="flex items-center space-x-4 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-[11px] font-black text-[#F63049] uppercase tracking-tighter leading-none">
                                    {user?.name || 'Administrator'}
                                </p>
                                <p className="text-[9px] font-bold text-[#8A244B]/30 uppercase tracking-widest mt-1">
                                    System Level: 01
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-tr from-[#F63049] to-[#8A244B] rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-[#F63049]/20 border-2 border-white">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#F9F8F6]/50">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
