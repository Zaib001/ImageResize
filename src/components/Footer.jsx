import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative py-16 px-6 md:px-12 border-t border-[#D02752]/10 bg-[#FFFFFF] z-10">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Brand Column */}
                <div className="md:col-span-1 space-y-6">
                    <div className="space-y-4">
                        <span className="text-2xl font-black tracking-tighter uppercase text-[#F63049] flex items-center gap-2">
                            RESIZELY
                        </span>
                        <p className="text-[13px] leading-relaxed text-[#8A244B]/60 font-medium max-w-xs">
                            Professional high-performance image synthesis and manipulation platform for enterprise assets.
                        </p>
                    </div>
                </div>

                {/* Company Links */}
                <div className="space-y-6">
                    <h4 className="text-[11px] font-black tracking-[0.2em] text-[#D02752] uppercase">Company</h4>
                    <ul className="space-y-4">
                        <li>
                            <Link to="/about" className="text-sm font-medium text-[#8A244B]/70 hover:text-[#F63049] transition-colors">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/blog" className="text-sm font-medium text-[#8A244B]/70 hover:text-[#F63049] transition-colors">
                                Blog
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="text-sm font-medium text-[#8A244B]/70 hover:text-[#F63049] transition-colors">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Legal Links */}
                <div className="space-y-6">
                    <h4 className="text-[11px] font-black tracking-[0.2em] text-[#D02752] uppercase">Legal</h4>
                    <ul className="space-y-4">
                        <li>
                            <Link to="/privacy" className="text-sm font-medium text-[#8A244B]/70 hover:text-[#F63049] transition-colors">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link to="/terms" className="text-sm font-medium text-[#8A244B]/70 hover:text-[#F63049] transition-colors">
                                Terms of Service
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Social / Newsletter or Empty */}
                <div className="space-y-6">
                    <h4 className="text-[11px] font-black tracking-[0.2em] text-[#D02752] uppercase">Connect</h4>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-[#F63049]/5 flex items-center justify-center text-[#F63049] hover:bg-[#F63049] hover:text-white transition-all duration-300">
                            <Twitter size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-[#F63049]/5 flex items-center justify-center text-[#F63049] hover:bg-[#F63049] hover:text-white transition-all duration-300">
                            <Github size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-[#F63049]/5 flex items-center justify-center text-[#F63049] hover:bg-[#F63049] hover:text-white transition-all duration-300">
                            <Linkedin size={18} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-[#D02752]/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[11px] font-bold tracking-[0.2em] text-[#8A244B]/30 uppercase">
                    © {currentYear} Resizely Technology Group. All rights reserved.
                </p>

            </div>
        </footer>
    );
};

export default Footer;
