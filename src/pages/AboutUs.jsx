import React from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import Navbar from '../components/Navbar';
import { Zap, Shield, LayoutGrid } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#8A244B] font-sans">
            <Navbar />
            <SEOHead
                title="About Us"
                description="Learn about the team and technology behind Resizely."
                slug="about"
            />

            <main className="max-w-[1000px] mx-auto px-6 py-20 md:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-12"
                >
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center space-x-3 px-6 py-2 rounded-full bg-[#F63049]/5 border border-[#F63049]/10 backdrop-blur-md mb-4">
                            <span className="text-[11px] font-black tracking-[0.3rem] uppercase text-[#F63049]/80">Our Mission</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-[#F63049] uppercase tracking-tighter">
                            Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F63049] to-[#D02752]">Precision</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-[#8A244B]/80 font-medium leading-relaxed">
                            Resizely is built for creators, developers, and enterprises who demand pixel-perfect image manipulation without compromising on security or speed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        {[
                            { icon: Zap, title: "Speed First", desc: "Our engine processes images in milliseconds using WASM technology directly in your browser." },
                            { icon: Shield, title: "Privacy Focused", desc: "Your images never leave your device for basic processing. We prioritize local-first manipulation." },
                            { icon: LayoutGrid, title: "Professional Tools", desc: "Access enterprise-grade compression, format conversion, and resizing algorithms." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className="p-8 rounded-[30px] bg-white border border-[#D02752]/10 shadow-lg shadow-[#F63049]/5 hover:shadow-[#F63049]/10 transition-shadow"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#F63049]/5 flex items-center justify-center text-[#F63049] mb-6">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-black text-[#D02752] uppercase mb-3">{item.title}</h3>
                                <p className="text-[#8A244B]/70 leading-relaxed text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 p-8 rounded-[30px] bg-[#F63049]/5 border border-[#F63049]/10 text-center">
                        <h3 className="text-2xl font-black text-[#D02752] uppercase mb-4">Contact Us</h3>
                        <p className="text-[#8A244B]/80 mb-6">
                            Have questions, suggestions, or enterprise needs? We'd love to hear from you.
                        </p>
                        <a href="mailto:contact@resizely.com" className="inline-block px-8 py-3 rounded-full bg-[#F63049] text-white font-bold tracking-widest uppercase hover:bg-[#D02752] transition-colors">
                            Get in Touch
                        </a>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default AboutUs;
