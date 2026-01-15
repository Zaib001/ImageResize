import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle2, ChevronRight, FileImage, AlertCircle, Maximize2, Shield, Sparkles } from 'lucide-react';

const ImageUploader = ({ onUpload, onRemove, externalImage }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const handleFileChange = (file) => {
        setError(null);
        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            setError('FORMAT NOT SUPPORTED. PLEASE USE JPEG, PNG, WEBP, OR GIF.');
            return;
        }

        if (file.size > maxSize) {
            setError('PAYLOAD LIMIT EXCEEDED. MAXIMUM FILE SIZE IS 5MB.');
            return;
        }

        const url = URL.createObjectURL(file);
        onUpload({
            file,
            previewUrl: url,
            name: file.name,
            size: file.size,
            type: file.type
        });
    };

    const onFileSelect = (e) => {
        const file = e.target.files[0];
        handleFileChange(file);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileChange(file);
    };

    const removeImage = () => {
        onRemove();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full h-full min-h-[400px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
                {!externalImage?.previewUrl ? (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative group h-full min-h-[400px] rounded-[32px] border-2 border-dashed transition-all duration-500 cursor-pointer flex flex-col items-center justify-center space-y-12 overflow-hidden
                            ${isDragging
                                ? 'border-[#F63049] bg-[#F63049]/5'
                                : 'border-[#F63049]/10 hover:border-[#F63049]/30 hover:bg-[#F63049]/5'}`}
                    >
                        <input
                            type="file"
                            className="hidden"
                            onChange={onFileSelect}
                            accept=".jpg,.jpeg,.png,.webp,.gif"
                            ref={fileInputRef}
                        />

                        {/* Background Decoration */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border-[1px] border-white/[0.03] rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-[1px] border-white/[0.02] rounded-full"
                            />
                        </div>

                        <div className="relative">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-24 h-24 bg-[#F63049]/5 text-[#F63049] rounded-[32px] flex items-center justify-center shadow-xl border border-[#F63049]/10 group-hover:scale-110 transition-transform duration-700"
                            >
                                <Upload className="w-10 h-10" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute -top-3 -right-3 w-10 h-10 bg-[#F63049] border border-white rounded-2xl flex items-center justify-center shadow-lg"
                            >
                                <Sparkles className="w-5 h-5 text-white" />
                            </motion.div>
                        </div>

                        <div className="text-center relative space-y-4">
                            <h2 className="text-3xl font-black text-[#F63049] tracking-[-0.05em] uppercase">Initialize Asset</h2>
                            <p className="text-[11px] font-black text-[#8A244B]/60 tracking-[0.4em] uppercase">
                                Drop Image or <span className="text-[#F63049]">Locate</span>
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-10">
                            <div className="flex -space-x-4">
                                {['JPG', 'PNG', 'WEBP'].map((ext, i) => (
                                    <div
                                        key={ext}
                                        className="w-12 h-12 rounded-2xl bg-white border border-[#F63049]/10 flex items-center justify-center text-[9px] font-black text-[#8A244B]/60 group-hover:border-[#D02752] transition-all duration-500 shadow-sm"
                                    >
                                        {ext}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center space-x-3 text-[9px] font-black uppercase tracking-[0.3em] text-[#8A244B]/40 group-hover:text-[#F63049]/60 transition-colors">
                                <Shield className="w-3.5 h-3.5" />
                                <span>Securing Assets</span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="space-y-12"
                    >
                        <div className="relative group rounded-[32px] overflow-hidden border border-[#D02752]/20 bg-white shadow-xl">
                            <motion.img
                                layoutId="uploaded-image"
                                src={externalImage.previewUrl}
                                alt="Preview"
                                className="w-full h-auto max-h-[600px] object-contain mx-auto"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#F63049]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                            <div className="absolute top-6 left-6 flex items-center space-x-3">
                                <div className="flex items-center space-x-3 px-5 py-2.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-[#D02752]/20 shadow-md">
                                    <div className="w-2 h-2 rounded-full bg-[#F63049] animate-pulse" />
                                    <span className="text-[10px] font-black text-[#D02752] tracking-[0.2em] uppercase">Validated Secure</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={removeImage}
                                className="absolute top-6 right-6 bg-white text-[#F63049] px-6 py-3 rounded-2xl shadow-xl border border-[#F63049]/20 flex items-center space-x-3 hover:bg-[#F63049] hover:text-white transition-all duration-300 z-10"
                            >
                                <X className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Cancel Asset</span>
                            </motion.button>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 bg-white rounded-[32px] border border-[#D02752]/10 shadow-sm">
                            <div className="flex items-center space-x-8 w-full md:w-auto">
                                <div className="w-20 h-20 bg-white border border-[#D02752]/20 rounded-2xl overflow-hidden p-1 shrink-0 group">
                                    <img src={externalImage.previewUrl} alt="Thumb" className="w-full h-full object-cover rounded-xl group-hover:scale-125 transition-transform duration-1000" />
                                </div>
                                <div className="min-w-0 space-y-2">
                                    <p className="text-lg font-black text-[#F63049] truncate uppercase tracking-tighter">
                                        {externalImage.name}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1 rounded-lg bg-[#D02752]/5 border border-[#D02752]/10 text-[9px] font-black text-[#D02752] uppercase tracking-widest">
                                            {externalImage.type.split('/')[1]}
                                        </span>
                                        <span className="text-[9px] font-black text-[#8A244B]/60 uppercase tracking-[0.2em]">
                                            {(externalImage.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 text-[9px] font-black text-[#8A244B]/50 uppercase tracking-[0.4em] bg-white px-6 py-4 rounded-2xl border border-[#D02752]/5 w-full md:w-auto justify-center shadow-sm">
                                <Maximize2 className="w-4 h-4 mr-2 text-[#F63049]" />
                                <span>Local Session Active</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-8 p-6 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-black tracking-[0.3em] uppercase rounded-2xl flex items-center space-x-4 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
                    >
                        <AlertCircle className="w-5 h-5" />
                        <p>{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageUploader;
