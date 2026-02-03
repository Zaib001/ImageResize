import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent = ({ onAccept }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('xresizer_cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('xresizer_cookie_consent', 'true');
        setIsVisible(false);
        if (onAccept) onAccept();
    };

    const handleDecline = () => {
        localStorage.setItem('xresizer_cookie_consent', 'false');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[200]"
                >
                    <div className="bg-white rounded-[32px] p-6 shadow-2xl border border-[#F63049]/10 backdrop-blur-xl relative overflow-hidden group">
                        {/* Decorative background */}
                        <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-[#F63049]/[0.03] rounded-full blur-2xl group-hover:bg-[#F63049]/[0.08] transition-colors duration-700" />

                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2.5 bg-[#F63049]/10 rounded-2xl text-[#F63049]">
                                    <Cookie size={20} />
                                </div>
                                <h3 className="font-black text-[#D02752] uppercase tracking-tight">Cookie Consent</h3>
                            </div>

                            <p className="text-sm text-[#8A244B]/70 font-medium leading-relaxed">
                                We use <strong>Google Analytics (GA4)</strong> to improve our tool. By accepting, you agree to our use of cookies as described in our{' '}
                                <Link to="/privacy" className="text-[#F63049] hover:underline inline-flex items-center gap-1 font-bold">
                                    Privacy Policy <ExternalLink size={12} />
                                </Link>
                            </p>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 px-6 py-3 bg-[#F63049] hover:bg-[#D02752] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-[#F63049]/20 transition-all hover:-translate-y-0.5"
                                >
                                    Accept All
                                </button>
                                <button
                                    onClick={handleDecline}
                                    className="px-6 py-3 bg-white border border-[#D02752]/10 text-[#8A244B]/40 hover:text-[#F63049] text-xs font-black uppercase tracking-widest rounded-2xl transition-all"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
