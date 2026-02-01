import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative py-8 px-6 md:px-12 border-t border-[#D02752]/10 bg-[#FFFFFF] z-10">
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

                {/* Left: Copyright */}
                <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#8A244B]/40 uppercase text-center md:text-left">
                    © {currentYear} Resizely.Core
                </p>

                {/* Right: Privacy | Terms */}
                <div className="flex items-center space-x-4">
                    <Link
                        to="/privacy"
                        className="text-[10px] sm:text-[11px] font-bold tracking-[0.1em] text-[#8A244B]/40 hover:text-[#F63049] uppercase transition-colors"
                    >
                        Privacy
                    </Link>
                    <span className="text-[#8A244B]/20">|</span>
                    <Link
                        to="/terms"
                        className="text-[10px] sm:text-[11px] font-bold tracking-[0.1em] text-[#8A244B]/40 hover:text-[#F63049] uppercase transition-colors"
                    >
                        Terms
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
