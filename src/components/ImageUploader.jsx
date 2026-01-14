import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle2, ChevronRight, FileImage, AlertCircle, Maximize2, Shield } from 'lucide-react';

const ImageUploader = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
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

        setSelectedImage(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
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
        setSelectedImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 0.4 }
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!previewUrl ? (
                    <motion.div
                        key="dropzone"
                        {...fadeInUp}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`relative group border-2 border-dashed rounded-[28px] p-16 md:p-24 transition-all duration-700 cursor-pointer flex flex-col items-center justify-center space-y-8 overflow-hidden bg-white/[0.01]
              ${isDragging
                                ? 'border-indigo-500 bg-indigo-500/10 shadow-[inner_0_0_60px_rgba(79,70,229,0.15)]'
                                : 'border-white/10 hover:border-white/25 hover:bg-white/[0.03]'}`}
                    >
                        <input
                            type="file"
                            className="hidden"
                            onChange={onFileSelect}
                            accept=".jpg,.jpeg,.png,.webp,.gif"
                            ref={fileInputRef}
                        />

                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="relative"
                        >
                            <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 rounded-[22px] flex items-center justify-center border border-white/10 group-hover:bg-indigo-500/30 transition-colors duration-500">
                                <Upload className="w-10 h-10 text-indigo-400" />
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center border-4 border-[#0b0f19] shadow-xl"
                            >
                                <ChevronRight className="w-4 h-4 text-white" />
                            </motion.div>
                        </motion.div>

                        <div className="text-center relative space-y-3">
                            <h2 className="text-2xl font-black text-white tracking-tight uppercase">Upload Asset</h2>
                            <p className="text-sm font-bold text-slate-500 tracking-wide uppercase">
                                Drag and drop or <span className="text-indigo-400">explore</span>
                            </p>
                        </div>

                        <div className="pt-6 flex items-center space-x-10">
                            <div className="flex -space-x-3">
                                {['JPG', 'PNG', 'WEBP', 'GIF'].map((ext, i) => (
                                    <motion.div
                                        key={ext}
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-indigo-500/40 transition-colors"
                                    >
                                        {ext}
                                    </motion.div>
                                ))}
                            </div>
                            <div className="h-6 w-px bg-white/10" />
                            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-slate-400 transition-colors">
                                <Shield className="w-3 h-3" />
                                <span>SECURE ENCRYPTION</span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        {...fadeInUp}
                        className="space-y-8"
                    >
                        <div className="relative group rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-black/20">
                            <motion.img
                                layoutId="uploaded-image"
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-auto max-h-[600px] object-contain mx-auto"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent opacity-60" />

                            <div className="absolute top-8 left-8 flex items-center space-x-3">
                                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase">Validated</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={removeImage}
                                className="absolute top-8 right-8 bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-full text-white/50 hover:text-white hover:bg-red-500/80 transition-all duration-300 shadow-xl"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-8 p-8 bg-white/[0.03] rounded-[32px] border border-white/10 backdrop-blur-3xl shadow-2xl"
                        >
                            <div className="flex items-center space-x-6">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center p-1 overflow-hidden shrink-0 group">
                                    <img src={previewUrl} alt="Thumb" className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="min-w-0 space-y-1.5">
                                    <p className="text-sm font-black text-white truncate max-w-[200px] md:max-w-[350px] uppercase tracking-wide">
                                        {selectedImage?.name}
                                    </p>
                                    <div className="flex items-center space-x-3">
                                        <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                            {selectedImage?.type.split('/')[1]}
                                        </span>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                            {(selectedImage?.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                        <div className="h-3 w-px bg-white/10" />
                                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center">
                                            <Maximize2 className="w-3 h-3 mr-1" />
                                            Original resolution
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="glow-button px-10 py-4.5 rounded-[20px] text-[13px] font-black uppercase tracking-[0.25em] flex items-center justify-center space-x-3"
                            >
                                <span>Process Asset</span>
                                <ChevronRight className="w-4 h-4" />
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-8 p-5 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-black tracking-widest uppercase rounded-[20px] flex items-center space-x-4 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
                    >
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                        <p>{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageUploader;
