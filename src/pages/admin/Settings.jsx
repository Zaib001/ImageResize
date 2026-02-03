import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings as SettingsIcon,
    Save,
    Shield,
    Zap,
    Globe,
    CheckCircle,
    Loader2,
    Key,
    Lock,
    Fingerprint, X
} from 'lucide-react';
import adminService from '../../services/adminService';
import authService from '../../services/authService';

const Settings = () => {
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

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
        setErrorMessage('');
        try {
            const response = await adminService.updateSettings(settings);
            if (response.success) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Failed to update settings:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to update settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setErrorMessage('New passwords do not match');
            return;
        }

        setIsSaving(true);
        setErrorMessage('');
        try {
            const response = await adminService.changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            if (response.success) {
                setShowSuccess(true);
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Failed to change password:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to change password');
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

    const handleRegisterPasskey = async () => {
        setIsSaving(true);
        setErrorMessage('');
        try {
            const result = await authService.registerPasskey();
            if (result.success) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Passkey registration error:', error);
            setErrorMessage(error.response?.data?.error || error.message || 'Failed to register passkey');
        } finally {
            setIsSaving(false);
        }
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
            key: "security",
            title: "Security & Access Management",
            icon: Shield,
            fields: [
                { key: "twoFactorAuth", label: "Passkey Authentication", type: "toggle" },
                { key: "sessionExpiry", label: "Session Lifecycle (Hours)", type: "number" },
                { key: "ipRestrictedMode", label: "Station Isolation Mode", type: "toggle" }
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
                        Configure XResizer CORE Engine
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

            {/* Success Toast / Error Message */}
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
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className="bg-red-500 text-white p-5 rounded-3xl flex items-center justify-between shadow-xl"
                    >
                        <div className="flex items-center space-x-4">
                            <span className="text-[11px] font-black uppercase tracking-widest">{errorMessage}</span>
                        </div>
                        <button onClick={() => setErrorMessage('')} className="text-white hover:opacity-75">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Unified Security & Access Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ease: [0.16, 1, 0.3, 1], duration: 1 }}
                className="glass-card p-10 rounded-[45px] border border-[#F63049]/5 hover:border-[#F63049]/10 transition-all group"
            >
                <div className="flex items-center space-x-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#F63049]/5 flex items-center justify-center text-[#F63049] group-hover:scale-110 transition-transform">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-[#F63049] uppercase tracking-tighter">Security & Access Management</h3>
                </div>

                {/* Security Protocols */}
                <div className="space-y-8 mb-12">
                    {sections[0].fields.map((field) => (
                        <div key={field.key} className="flex items-center justify-between border-b border-[#F63049]/5 pb-6 last:border-0 last:pb-0">
                            <div className="space-y-1">
                                <label className="text-[11px] font-black uppercase tracking-widest text-[#8A244B]/60">
                                    {field.label}
                                </label>
                                {field.key === 'twoFactorAuth' && (
                                    <div className="space-y-2 mt-2">
                                        <p className="text-[9px] text-[#8A244B]/30 font-bold uppercase italic">
                                            {settings.security.twoFactorAuth ? "Active: Passkey Protected" : "Inactive: Standard Login"}
                                        </p>
                                        {settings.security.twoFactorAuth && (
                                            <button
                                                onClick={handleRegisterPasskey}
                                                className="flex items-center space-x-2 px-4 py-2 bg-[#F63049]/10 text-[#F63049] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#F63049]/20 transition-all"
                                            >
                                                <Fingerprint className="w-3 h-3" />
                                                <span>Register New Passkey</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {field.type === 'toggle' ? (
                                <button
                                    onClick={() => handleFieldChange('security', field.key, !settings.security[field.key])}
                                    className={`w-14 h-7 rounded-full transition-all relative p-1 ${settings.security[field.key] ? 'bg-[#F63049]' : 'bg-[#F63049]/10'}`}
                                >
                                    <motion.div
                                        animate={{ x: settings.security[field.key] ? 28 : 0 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        className="w-5 h-5 bg-white rounded-full shadow-md"
                                    />
                                </button>
                            ) : field.type === 'number' ? (
                                <input
                                    type="number"
                                    value={settings.security[field.key]}
                                    onChange={(e) => handleFieldChange('security', field.key, parseInt(e.target.value))}
                                    className="w-24 px-4 py-2 bg-[#F63049]/5 border border-transparent rounded-2xl focus:bg-white focus:border-[#F63049]/20 outline-none text-[11px] font-bold text-[#8A244B]/60 transition-all text-center"
                                />
                            ) : null}
                        </div>
                    ))}
                </div>

                {/* Password Change Section */}
                <div className="pt-8 border-t border-[#F63049]/10">
                    <div className="flex items-center space-x-3 mb-6">
                        <Key className="w-5 h-5 text-[#F63049]" />
                        <h4 className="text-sm font-black text-[#F63049] uppercase tracking-wider">Change Password</h4>
                    </div>

                    <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-widest text-[#8A244B]/60 flex items-center gap-2">
                                <Lock className="w-3 h-3" /> Current Password
                            </label>
                            <input
                                type="password"
                                required
                                value={passwordData.oldPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                className="w-full px-6 py-4 bg-[#F63049]/5 border border-transparent rounded-2xl focus:bg-white focus:border-[#F63049]/20 outline-none text-[11px] font-bold text-[#8A244B]/60 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-widest text-[#8A244B]/60 flex items-center gap-2">
                                <Key className="w-3 h-3" /> New Password
                            </label>
                            <input
                                type="password"
                                required
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="w-full px-6 py-4 bg-[#F63049]/5 border border-transparent rounded-2xl focus:bg-white focus:border-[#F63049]/20 outline-none text-[11px] font-bold text-[#8A244B]/60 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-widest text-[#8A244B]/60 flex items-center gap-2">
                                <CheckCircle className="w-3 h-3" /> Confirm Identity
                            </label>
                            <div className="flex gap-4">
                                <input
                                    type="password"
                                    required
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="flex-1 px-6 py-4 bg-[#F63049]/5 border border-transparent rounded-2xl focus:bg-white focus:border-[#F63049]/20 outline-none text-[11px] font-bold text-[#8A244B]/60 transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-8 py-4 bg-[#F63049] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-[#F63049]/20 transition-all disabled:opacity-50 whitespace-nowrap"
                                >
                                    {isSaving ? 'Updating...' : 'Update Key'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>

        </div>
    );
};

export default Settings;
