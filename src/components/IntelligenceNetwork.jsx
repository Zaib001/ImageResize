import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, ShieldCheck, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const IntelligenceNetwork = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const response = await axios.post(`${API_URL}/network/subscribe`, { email });
            setStatus('success');
            setMessage(response.data.message);
            setEmail('');
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Connection to the network failed. Please try again.');
        }
    };

    return (
        <section className="relative py-32 px-6 overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F63049] opacity-[0.03] blur-[120px] rounded-full animate-pulse" />
            </div>

            <div className="max-w-6xl mx-auto relative">
                <div className="glass-card p-8 md:p-20 rounded-[40px] border border-[#F63049]/10 relative overflow-hidden text-center group">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F63049]/20 to-transparent" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        {/* Header */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center space-x-3 px-6 py-2 rounded-full bg-[#F63049]/5 border border-[#F63049]/10 backdrop-blur-md mb-4 shadow-sm">
                                <Sparkles className="w-4 h-4 text-[#F63049]" />
                                <span className="text-[10px] font-black tracking-[0.3rem] uppercase text-[#F63049]">Intelligence Network</span>
                            </div>

                            <h2 className="text-5xl md:text-7xl font-black text-[#F63049] tracking-[-0.05em] leading-[0.9] uppercase max-w-4xl mx-auto">
                                Join the Global <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F63049] to-[#D02752]">Expert Collective</span>
                            </h2>

                            <p className="text-lg md:text-xl text-[#8A244B]/60 font-medium max-w-2xl mx-auto tracking-tight">
                                Access private imaging modules, enterprise-grade research, and participate in the collective evolution of precision digital assets.
                            </p>
                        </div>

                        {/* Subscription Form */}
                        <div className="max-w-xl mx-auto relative group">
                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-6 px-10 rounded-3xl bg-[#F63049]/5 border border-[#F63049]/20 flex items-center justify-center space-x-4"
                                    >
                                        <CheckCircle2 className="w-6 h-6 text-[#F63049]" />
                                        <span className="font-black text-[#F63049] uppercase tracking-widest text-sm">{message}</span>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        onSubmit={handleSubmit}
                                        className="relative flex flex-col md:flex-row gap-4"
                                    >
                                        <div className="relative flex-1">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A244B]/30 group-focus-within:text-[#F63049] transition-colors" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="ENTER ENCRYPTION KEY (EMAIL)"
                                                required
                                                className="w-full bg-white/50 backdrop-blur-xl border-2 border-[#D02752]/10 rounded-[28px] pl-16 pr-8 py-5 text-sm font-black text-[#8A244B] focus:border-[#F63049] focus:bg-white outline-none transition-all placeholder:text-[#8A244B]/20 shadow-lg"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="px-10 py-5 bg-[#F63049] text-white rounded-[28px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#F63049]/20 hover:shadow-2xl hover:bg-[#D02752] transition-all flex items-center justify-center space-x-3 group"
                                        >
                                            {status === 'loading' ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <span>Initialize Access</span>
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>

                            {status === 'error' && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full mt-4 left-0 right-0 text-center text-[10px] font-black text-[#F63049] uppercase tracking-widest"
                                >
                                    {message}
                                </motion.p>
                            )}
                        </div>

                        {/* Social Proof */}
                        <div className="pt-8 border-t border-[#F63049]/5 flex flex-col md:flex-row items-center justify-center gap-12 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                            <div className="flex items-center space-x-3">
                                <ShieldCheck className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encryption</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Send className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Global Asset Reach</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default IntelligenceNetwork;
