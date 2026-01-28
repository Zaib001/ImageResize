import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings as SettingsIcon,
    Save,
    Shield,
    Zap,
    Globe,
    CheckCircle,
    Loader2
} from 'lucide-react';
import adminService from '../../services/adminService';

const Settings = () => {
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await adminService.getSettings();
                if (response.success) {
                    setSettings(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await adminService.updateSettings(settings);
            if (response.success) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Failed to update settings:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleFieldChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 text-[#F63049] animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A244B]/40">Initialising Core Parameters...</p>
            </div>
        );
    }

    const sections = [
        {
            key: "imaging",
            title: "Imaging Engine",
            icon: Zap,
            fields: [
                { key: "neuralUpscaling", label: "Neural Warp (Upscaling)", type: "toggle" },
                { key: "maxResolution", label: "Max Resolution (Pixels)", type: "number" },
                { key: "compressionAlgorithm", label: "Compression Mode", type: "select", options: ["Sharp (Balanced)", "Tiny (Size)", "lossless (Quality)"] }
            ]
        },
        {
            key: "security",
            title: "Security Protocols",
            icon: Shield,
            fields: [
                { key: "twoFactorAuth", label: "Two-Factor Auth", type: "toggle" },
                { key: "sessionExpiry", label: "Session Lifecycle (Hours)", type: "number" },
                { key: "ipRestrictedMode", label: "Station Isolation Mode", type: "toggle" }
            ]
        },
        {
            key: "seo",
            title: "Digital Presence (SEO)",
            icon: Globe,
            fields: [
                { key: "sitemapAutoGeneration", label: "Autonomous Sitemap", type: "toggle" },
                { key: "metaSuffix", label: "Meta Branding Suffix", type: "text" },
                { key: "ogFallbackImage", label: "OG Matrix Image Root", type: "text" }
            ]
        }
    ];

    return (
        <div className="space-y-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#F63049]/5 rounded-2xl flex items-center justify-center border border-[#F63049]/10 shadow-sm transition-transform hover:rotate-12">
                            <SettingsIcon className="w-6 h-6 text-[#F63049]" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter text-[#F63049] uppercase">
                            System <span className="opacity-30">Parameters</span>
                        </h1>
                    </div>
                    <p className="text-[#8A244B]/40 text-xs font-bold uppercase tracking-[0.3em] ml-16">
                        Configure Resizely CORE Engine
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-3 px-8 py-4 bg-[#F63049] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-[#F63049]/20 transition-all disabled:opacity-50"
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    <span>{isSaving ? 'Synchronising...' : 'Deploy Changes'}</span>
                </motion.button>
            </header>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white p-5 rounded-3xl flex items-center justify-between shadow-xl shadow-[#10B981]/10"
                    >
                        <div className="flex items-center space-x-4">
                            <CheckCircle className="w-6 h-6" />
                            <span className="text-[11px] font-black uppercase tracking-widest">Protocol Matrix Updated</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {sections.map((section, idx) => (
                    <motion.div
                        key={section.key}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, ease: [0.16, 1, 0.3, 1], duration: 1 }}
                        className="glass-card p-10 rounded-[45px] border border-[#F63049]/5 hover:border-[#F63049]/10 transition-all group"
                    >
                        <div className="flex items-center space-x-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-[#F63049]/5 flex items-center justify-center text-[#F63049] group-hover:scale-110 transition-transform">
                                <section.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-[#F63049] uppercase tracking-tighter">{section.title}</h3>
                        </div>

                        <div className="space-y-8">
                            {section.fields.map((field) => (
                                <div key={field.key} className="flex items-center justify-between border-b border-[#F63049]/5 pb-6 last:border-0 last:pb-0">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-[#8A244B]/60">
                                        {field.label}
                                    </label>

                                    {field.type === 'toggle' ? (
                                        <button
                                            onClick={() => handleFieldChange(section.key, field.key, !settings[section.key][field.key])}
                                            className={`w-14 h-7 rounded-full transition-all relative p-1 ${settings[section.key][field.key] ? 'bg-[#F63049]' : 'bg-[#F63049]/10'}`}
                                        >
                                            <motion.div
                                                animate={{ x: settings[section.key][field.key] ? 28 : 0 }}
                                                className="w-5 h-5 rounded-full bg-white shadow-md"
                                            />
                                        </button>
                                    ) : field.type === 'number' ? (
                                        <input
                                            type="number"
                                            value={settings[section.key][field.key]}
                                            onChange={(e) => handleFieldChange(section.key, field.key, parseInt(e.target.value))}
                                            className="w-28 px-4 py-3 bg-[#F63049]/5 border border-transparent rounded-2xl focus:bg-white focus:border-[#F63049]/20 outline-none text-[12px] font-black text-[#F63049] text-center transition-all"
                                        />
                                    ) : field.type === 'select' ? (
                                        <div className="relative">
                                            <select
                                                value={settings[section.key][field.key]}
                                                onChange={(e) => handleFieldChange(section.key, field.key, e.target.value)}
                                                className="pl-6 pr-10 py-3 bg-[#F63049]/5 border border-transparent rounded-2xl focus:bg-white focus:border-[#F63049]/20 outline-none text-[11px] font-black text-[#8A244B]/60 appearance-none cursor-pointer transition-all"
                                            >
                                                {field.options.map(opt => <option key={opt}>{opt}</option>)}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                                <Zap className="w-3 h-3 text-[#F63049] fill-current" />
                                            </div>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={settings[section.key][field.key]}
                                            onChange={(e) => handleFieldChange(section.key, field.key, e.target.value)}
                                            className="w-56 px-6 py-3 bg-[#F63049]/5 border border-transparent rounded-2xl focus:bg-white focus:border-[#F63049]/20 outline-none text-[11px] font-bold text-[#8A244B]/60 transition-all placeholder:opacity-20"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Settings;
