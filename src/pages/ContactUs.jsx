import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Navbar from '../components/Navbar';
import { contactService } from '../services/contactService';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error' | null
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (status) setStatus(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        setErrorMessage('');

        try {
            await contactService.submitContact(formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMessage(error.response?.data?.error || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#8A244B] font-sans">
            <Navbar />
            <SEOHead
                title="Contact Us"
                description="Get in touch with the Resizely team for support, inquiries, or feedback."
                slug="contact"
            />

            <main className="max-w-[1200px] mx-auto px-6 py-20 md:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center space-x-3 px-6 py-2 rounded-full bg-[#F63049]/5 border border-[#F63049]/10 backdrop-blur-md mb-4">
                            <span className="text-[11px] font-black tracking-[0.3rem] uppercase text-[#F63049]/80">Support</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-[#F63049] uppercase tracking-tighter">
                            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F63049] to-[#D02752]">Touch</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-[#8A244B]/80 font-medium leading-relaxed">
                            We're here to help. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="p-8 rounded-[30px] bg-[#F63049]/5 border border-[#F63049]/10 space-y-6">
                                <h3 className="text-2xl font-black text-[#D02752] uppercase mb-6">Contact Info</h3>

                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#F63049] shrink-0">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#D02752] uppercase text-xs tracking-widest mb-1">Email</p>
                                        <a href="mailto:support@resizely.com" className="text-lg font-medium text-[#8A244B] hover:text-[#F63049] transition-colors">
                                            support@resizely.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#F63049] shrink-0">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#D02752] uppercase text-xs tracking-widest mb-1">HQ</p>
                                        <p className="text-lg font-medium text-[#8A244B]">
                                            San Francisco, CA<br />
                                            United States
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="p-8 md:p-10 rounded-[40px] bg-white border border-[#D02752]/10 shadow-xl shadow-[#F63049]/5 relative overflow-hidden">
                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center text-center py-12 space-y-6"
                                >
                                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#D02752]">Message Sent!</h3>
                                    <p className="text-[#8A244B]/70 max-w-md">
                                        Thank you for reaching out. We have received your message and will get back to you shortly.
                                    </p>
                                    <button
                                        onClick={() => setStatus(null)}
                                        className="mt-6 px-8 py-3 rounded-full bg-[#F63049]/10 text-[#F63049] font-bold hover:bg-[#F63049]/20 transition-colors"
                                    >
                                        Send Another
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {status === 'error' && (
                                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                                            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                                            <p className="text-sm text-red-600 font-medium">{errorMessage}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#8A244B]/60 uppercase tracking-wider ml-1">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full h-12 px-4 rounded-2xl bg-[#F63049]/5 border border-transparent focus:bg-white focus:border-[#F63049]/30 focus:outline-none focus:ring-4 focus:ring-[#F63049]/5 transition-all font-medium text-[#8A244B]"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#8A244B]/60 uppercase tracking-wider ml-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full h-12 px-4 rounded-2xl bg-[#F63049]/5 border border-transparent focus:bg-white focus:border-[#F63049]/30 focus:outline-none focus:ring-4 focus:ring-[#F63049]/5 transition-all font-medium text-[#8A244B]"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A244B]/60 uppercase tracking-wider ml-1">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-12 px-4 rounded-2xl bg-[#F63049]/5 border border-transparent focus:bg-white focus:border-[#F63049]/30 focus:outline-none focus:ring-4 focus:ring-[#F63049]/5 transition-all font-medium text-[#8A244B]"
                                            placeholder="How can we help?"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A244B]/60 uppercase tracking-wider ml-1">Message</label>
                                        <textarea
                                            name="message"
                                            rows="5"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-4 rounded-2xl bg-[#F63049]/5 border border-transparent focus:bg-white focus:border-[#F63049]/30 focus:outline-none focus:ring-4 focus:ring-[#F63049]/5 transition-all font-medium text-[#8A244B] resize-none"
                                            placeholder="Tell us more about your inquiry..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-14 rounded-2xl bg-[#F63049] hover:bg-[#D02752] text-white font-bold uppercase tracking-widest transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#F63049]/20 hover:shadow-xl hover:shadow-[#F63049]/30 hover:-translate-y-1"
                                    >
                                        {loading ? (
                                            <Loader className="animate-spin" />
                                        ) : (
                                            <>
                                                <span>Send Message</span>
                                                <Send size={18} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default ContactUs;
