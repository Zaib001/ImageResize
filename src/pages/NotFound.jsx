import React from 'react';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
            <Helmet>
                <title>404 - Page Not Found | xResizer</title>
                <meta name="prerender-status-code" content="404" />
                <meta name="robots" content="noindex" />
            </Helmet>
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F63049] opacity-[0.03] blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D02752] opacity-[0.02] blur-[120px]" />
            </div>

            <div className="max-w-md w-full text-center space-y-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                >
                    <div className="flex justify-center">
                        <div className="w-24 h-24 bg-[#F63049]/5 rounded-[32px] flex items-center justify-center text-[#F63049] border border-[#F63049]/10 shadow-sm relative">
                            <AlertCircle size={48} strokeWidth={1.5} />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute inset-0 rounded-[32px] bg-[#F63049]/10 -z-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-8xl font-black text-[#F63049] tracking-tighter uppercase leading-none">404</h1>
                        <p className="text-xl font-bold text-[#8A244B] uppercase tracking-widest">Page Not Found</p>
                    </div>

                    <p className="text-[#8A244B]/60 font-medium leading-relaxed max-w-[280px] mx-auto">
                        The resource you are looking for has been moved or no longer exists.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-3 px-8 py-4 bg-[#F63049] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#D02752] transition-all shadow-xl shadow-[#F63049]/20 hover:shadow-2xl hover:scale-105 active:scale-95"
                    >
                        <Home size={18} />
                        <span>Back to Home</span>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
