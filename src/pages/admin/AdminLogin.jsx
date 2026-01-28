import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await authService.login(email, password);
            if (result.success) {
                login(result.data.admin, result.data.token);
                navigate('/admin/dashboard');
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials or server error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        translate: ['0% 0%', '20% -10%', '0% 0%'],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="premium-blur top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F63049] opacity-[0.05]"
                />
                <motion.div
                    animate={{
                        translate: ['0% 0%', '-15% 15%', '0% 0%'],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="premium-blur bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-[#D02752] opacity-[0.03]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md z-10"
            >
                <div className="glass-card p-10 rounded-[40px] shadow-2xl border border-[#F63049]/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F63049] via-[#D02752] to-[#8A244B]" />

                    <div className="flex flex-col items-center mb-10">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-16 h-16 bg-[#F63049]/5 rounded-2xl flex items-center justify-center border border-[#F63049]/10 mb-6"
                        >
                            <ShieldCheck className="w-8 h-8 text-[#F63049]" />
                        </motion.div>
                        <h1 className="text-3xl font-black tracking-tighter text-[#F63049] uppercase">
                            Admin <span className="opacity-30">Portal</span>
                        </h1>
                        <p className="text-[#8A244B]/50 text-xs font-bold uppercase tracking-[0.3em] mt-2">
                            Secure Core Access
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/40 ml-4">
                                Authentication ID
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-[#8A244B]/20 group-focus-within:text-[#F63049] transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@resizely.core"
                                    className="w-full pl-12 pr-4 py-4 bg-[#F63049]/5 border border-transparent rounded-2xl focus:border-[#F63049]/20 focus:bg-white transition-all outline-none font-medium placeholder:text-[#8A244B]/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/40 ml-4">
                                Secret Key
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-[#8A244B]/20 group-focus-within:text-[#F63049] transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full pl-12 pr-12 py-4 bg-[#F63049]/5 border border-transparent rounded-2xl focus:border-[#F63049]/20 focus:bg-white transition-all outline-none font-medium placeholder:text-[#8A244B]/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8A244B]/20 hover:text-[#F63049]"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#F63049]/5 border border-[#F63049]/20 text-[#F63049] text-[11px] font-bold p-3 rounded-xl text-center uppercase tracking-wider"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            className="w-full py-4 bg-[#F63049] text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-[#F63049]/20 hover:shadow-xl hover:shadow-[#F63049]/30 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Initiate Protocol</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-[#F63049]/5 text-center">
                        <p className="text-[10px] font-medium text-[#8A244B]/30 uppercase tracking-[0.2em]">
                            End-to-end Encrypted Session
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
