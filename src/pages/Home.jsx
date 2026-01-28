import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Shield, LayoutGrid, Menu, X } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import ResizeOptions from '../components/ResizeOptions';
import IntelligenceNetwork from '../components/IntelligenceNetwork';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import 'react-image-crop/dist/ReactCrop.css';
import { Link } from 'react-router-dom';

function Home() {
    const [imageData, setImageData] = useState(null);
    const [crop, setCrop] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [isProcessingPreview, setIsProcessingPreview] = useState(false);
    const lastOptionsRef = useRef({});

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const handleImageUpload = (data) => {
        setImageData(data);
        setCrop(null);
        setRotation(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const abortControllerRef = useRef(null);
    const lastPreviewParamsRef = useRef(null);

    const handleResizeUpdate = async (options) => {
        if (!imageData?.file) return;

        if (options) {
            lastOptionsRef.current = { ...lastOptionsRef.current, ...options };
        }
        const currentOptions = { ...lastOptionsRef.current, ...options };

        const previewParams = {
            width: currentOptions.width,
            height: currentOptions.height,
            unit: currentOptions.unit,
            mode: currentOptions.mode,
            format: currentOptions.format,
            quality: currentOptions.quality,
            backgroundColor: currentOptions.backgroundColor,
            maxSizeKB: currentOptions.maxSizeKB,
            resolutionMode: currentOptions.resolutionMode,
            dpi: currentOptions.dpi
        };

        const paramsChanged = JSON.stringify(previewParams) !== JSON.stringify(lastPreviewParamsRef.current);

        if (!paramsChanged && lastPreviewParamsRef.current !== null) {
            return;
        }

        lastPreviewParamsRef.current = previewParams;

        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        if (currentOptions.width && currentOptions.height) {
            setIsProcessingPreview(true);
            try {
                const formData = new FormData();
                formData.append('image', imageData.file);
                formData.append('width', currentOptions.width);
                formData.append('height', currentOptions.height);
                formData.append('unit', currentOptions.unit || 'px');
                formData.append('mode', currentOptions.mode || 'stretch');
                formData.append('isPreview', 'true');

                const previewFormat = (currentOptions.format === 'pdf') ? 'jpeg' : (currentOptions.format || 'jpeg');
                formData.append('format', previewFormat);
                formData.append('quality', currentOptions.quality || 90);
                formData.append('backgroundColor', currentOptions.backgroundColor);
                if (currentOptions.maxSizeKB) formData.append('maxSizeKB', currentOptions.maxSizeKB);
                if (currentOptions.resolutionMode) formData.append('resolutionMode', currentOptions.resolutionMode);
                if (currentOptions.dpi) formData.append('dpi', currentOptions.dpi);

                const blob = await api.processImage(formData, controller.signal);
                if (!blob) return;

                const newUrl = URL.createObjectURL(blob);

                setImageData(prev => ({
                    ...prev,
                    previewUrl: newUrl,
                    previewSize: blob.size
                }));
            } catch (err) {
                if (err.name === 'CanceledError' || err.name === 'AbortError' || axios.isCancel(err) || err.code === 'ERR_CANCELED') {
                    return;
                }
                console.error("Preview update failed", err);
            } finally {
                setIsProcessingPreview(false);
            }
        }
    };

    const handleRemoveImage = () => {
        setImageData(null);
    };

    useEffect(() => {
        return () => {
            if (imageData?.previewUrl) {
                URL.revokeObjectURL(imageData.previewUrl);
            }
        };
    }, [imageData]);

    return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#8A244B] selection:bg-[#F63049]/10 font-sans overflow-x-hidden">
            <div className="noise-overlay" />

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        translate: ['0% 0%', '15% -15%', '0% 0%'],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="premium-blur top-[-15%] left-[-15%] w-[60%] h-[60%] bg-[#F63049] opacity-[0.03]"
                />
                <motion.div
                    animate={{
                        translate: ['0% 0%', '-10% 20%', '0% 0%'],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="premium-blur bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-[#D02752] opacity-[0.02]"
                />
            </div>

            <Navbar />

            <main className="relative max-w-[1400px] min-h-[80vh] mx-auto px-6 py-12 md:py-24">
                <AnimatePresence mode="wait">
                    {imageData === null && (
                        <motion.div
                            key="hero-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center mb-32 space-y-12"
                        >
                            <div className="inline-flex items-center space-x-3 px-6 py-2 rounded-full bg-[#F63049]/5 border border-[#F63049]/10 backdrop-blur-md mb-4 animate-float">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#F63049] animate-pulse" />
                                <span className="text-[11px] font-black tracking-[0.3rem] uppercase text-[#F63049]/80">Professional Mode</span>
                            </div>

                            <h1 className="text-[12vw] sm:text-8xl md:text-[10rem] font-black text-[#F63049] tracking-[-0.07em] leading-[0.8] uppercase flex flex-col items-center">
                                <span>Precision</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F63049] to-[#D02752] translate-y-[-10%]">Imaging.</span>
                            </h1>

                            <div className="max-w-2xl mx-auto space-y-8">
                                <p className="text-xl md:text-2xl text-[#8A244B]/80 font-medium leading-relaxed tracking-tight">
                                    High-performance image synthesis and manipulation platform. <br />
                                    Engineered with corporate-grade security for enterprise assets.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    variants={itemVariants}
                    layout
                    className={`grid grid-cols-1 ${imageData ? 'lg:grid-cols-12' : 'grid-cols-1'} gap-8 md:gap-20 items-stretch h-full`}
                >
                    <motion.div layout className={`relative group h-full ${imageData ? 'lg:col-span-7 xl:col-span-8' : 'w-full max-w-4xl mx-auto'}`}>
                        <div className="glass-card h-full p-4 md:p-8 rounded-[40px] relative overflow-hidden">
                            <ImageUploader
                                onUpload={handleImageUpload}
                                onRemove={handleRemoveImage}
                                externalImage={imageData}
                                crop={crop}
                                setCrop={setCrop}
                                rotation={rotation}
                                setRotation={setRotation}
                            />

                            {/* Processing Overlay */}
                            <AnimatePresence>
                                {isProcessingPreview && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-md"
                                    >
                                        <div className="flex flex-col items-center space-y-6">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-2xl border-2 border-[#F63049]/20 border-t-[#F63049] animate-spin" />
                                                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-[#F63049] animate-pulse" />
                                            </div>
                                            <div className="text-center space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F63049]">Processing</p>
                                                <p className="text-[9px] font-bold text-[#8A244B]/40 uppercase tracking-widest">Optimizing Assets...</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {imageData && (
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32 h-fit"
                            >
                                <div className="glass-card p-8 md:p-10 rounded-[40px] border border-white/5">
                                    <ResizeOptions
                                        onResize={handleResizeUpdate}
                                        imageFile={imageData?.file}
                                        initialDimensions={{ width: imageData?.width || 1920, height: imageData?.height || 1080 }}
                                        previewSize={imageData?.previewSize}
                                        crop={crop}
                                        rotation={rotation}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {imageData === null && (
                    <div className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-16">
                        {[
                            { icon: Zap, title: "Neural Warp", desc: "Proprietary upscaling algorithms optimized for precision." },
                            { icon: Shield, title: "Secure Core", desc: "Enterprise-grade data isolation and ephemeral processing." },
                            { icon: LayoutGrid, title: "Parallel Engine", desc: "High-throughput batch processing for rapid deployment." }
                        ].map((feature) => (
                            <div key={feature.title} className="space-y-8">
                                <div className="w-16 h-16 rounded-2xl bg-[#F63049]/5 border border-[#F63049]/10 flex items-center justify-center text-[#F63049]">
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-black text-[#D02752] uppercase">{feature.title}</h3>
                                    <p className="text-[#8A244B]/70 text-base leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <IntelligenceNetwork />

            <footer className="relative py-24 px-6 md:px-12 mt-40 border-t border-[#D02752]/10">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <span className="text-2xl font-black tracking-tighter uppercase text-[#F63049]">RESIZELY</span>
                        <p className="text-[11px] font-bold tracking-[0.3em] text-[#8A244B]/40 uppercase">Version 4.3.0 Berry Edition</p>
                    </div>
                    <p className="text-[11px] font-black tracking-[0.2em] text-[#8A244B]/20 uppercase">
                        RESIZELY TECHNOLOGY GROUP © 2026
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
