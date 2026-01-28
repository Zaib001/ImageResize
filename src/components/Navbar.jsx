import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Menu, X, ChevronLeft, Share2, Bookmark, Check } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ extraActions }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Engine', path: '/' },
        { name: 'Blog', path: '/blog' }
    ];

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-8 md:px-12 py-5 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-[#F63049]/5 py-4' : 'bg-transparent'
                    }`}
            >
                <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                    {/* Logo - Alignment: Left */}
                    <div>
                        <Link to="/" className="flex items-center space-x-4 cursor-pointer z-[110]">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isScrolled ? 'bg-[#F63049] border-[#F63049]/10 shadow-lg shadow-[#F63049]/20' : 'bg-[#F63049]/5 border-[#F63049]/10'
                                }`}>
                                <Image className={`w-6 h-6 transition-colors duration-500 ${isScrolled ? 'text-white' : 'text-[#F63049]'}`} />
                            </div>
                            <span className="text-2xl font-black tracking-[-0.05em] text-[#F63049]">
                                RESIZELY<span className="text-[#F63049]/20 truncate hidden sm:inline">.CORE</span>
                            </span>
                        </Link>
                    </div>

                    {/* Navigation & Actions - Alignment: Right */}
                    <div className="flex items-center space-x-12">
                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center space-x-10">
                            {navLinks.map((link) => (
                                <div key={link.name}>
                                    <Link
                                        to={link.path}
                                        className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-300 relative group ${location.pathname === link.path ? 'text-[#F63049]' : 'text-[#8A244B]/70 hover:text-[#F63049]'
                                            }`}
                                    >
                                        {link.name}
                                        <span className={`absolute -bottom-2 left-0 h-[2px] bg-[#F63049] transition-all duration-500 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                                            }`} />
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Extra Actions (Contextual) */}
                        {extraActions && (
                            <div className="hidden sm:flex items-center space-x-8 pl-8 border-l border-[#F63049]/5">
                                {extraActions}
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-[#8A244B]/50 hover:text-[#F63049] transition-colors z-[110]"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[105] bg-white flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="noise-overlay" />
                        <div className="space-y-12 w-full max-w-sm">
                            {navLinks.map((link, i) => (
                                <div key={link.name}>
                                    <Link
                                        to={link.path}
                                        className={`text-6xl font-black uppercase tracking-tighter transition-colors block ${location.pathname === link.path ? 'text-[#F63049]' : 'text-[#8A244B]/20 hover:text-[#F63049]'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </div>
                            ))}

                            {extraActions && (
                                <div className="pt-12 border-t border-[#F63049]/5 flex justify-center space-x-8">
                                    {extraActions}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
