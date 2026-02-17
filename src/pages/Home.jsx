import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Shield, LayoutGrid, Globe, MousePointer2, Star, Target, ShieldCheck, Gift } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import ResizeOptions from '../components/ResizeOptions';
import Navbar from '../components/Navbar';
import SEOHead from '../components/SEOHead';
import { api } from '../services/api';
import 'react-image-crop/dist/ReactCrop.css';

function Home() {
    const [imageData, setImageData] = useState(null);
    const [crop, setCrop] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [isProcessingPreview, setIsProcessingPreview] = useState(false);
    const { targetSlug } = useParams();
    const lastOptionsRef = useRef({});

    // SEO Data Mapping
    const seoMap = {
        'compress-jpg-to-10kb': { kb: 10, title: 'Compress JPG to 10KB', desc: 'Fast and free online tool to compress JPG images exactly to 10KB without losing quality.' },
        'compress-jpg-to-20kb': { kb: 20, title: 'Compress JPG to 20KB', desc: 'Securely compress your JPG images to 20KB. Best for official form uploads.' },
        'compress-jpg-to-30kb': { kb: 30, title: 'Compress JPG to 30KB', desc: 'Reduce JPG file size to 30KB online. Perfect for web optimization.' },
        'compress-jpg-to-50kb': { kb: 50, title: 'Compress JPG to 50KB', desc: 'Convert JPG to 50KB in seconds. Professional quality compression.' },
        'compress-jpg-to-100kb': { kb: 100, title: 'Compress JPG to 100KB', desc: 'High-quality JPG compression to 100KB. Ideal for email attachments.' }
    };

    const currentSeo = seoMap[targetSlug] || {
        kb: null,
        title: 'Free Image Resizer - Resize & Optimize Photos',
        desc: 'Resize and optimize your images in seconds. Fast, easy, and 100% private. No upload limits.'
    };

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
            <SEOHead
                title={currentSeo.title}
                description={currentSeo.desc}
                slug={targetSlug ? `/${targetSlug}` : ''}
            />
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
                                <span className="text-[11px] font-black tracking-[0.3rem] uppercase text-[#F63049]/80">Free Tool</span>
                            </div>

                            <h1 className="text-[12vw] sm:text-8xl md:text-[10rem] font-black text-[#F63049] tracking-[-0.07em] leading-[0.8] uppercase flex flex-col items-center">
                                <span>Free Image</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F63049] to-[#D02752] translate-y-[-10%]">Resizer</span>
                            </h1>

                            <div className="max-w-2xl mx-auto space-y-8">
                                <p className="text-xl md:text-2xl text-[#8A244B]/80 font-medium leading-relaxed tracking-tight">
                                    {targetSlug ? currentSeo.desc : 'Resize images in seconds'}
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
                                        initialDimensions={{ width: imageData?.width, height: imageData?.height }}
                                        previewSize={imageData?.previewSize}
                                        crop={crop}
                                        rotation={rotation}
                                        initialMaxSizeKB={currentSeo.kb}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {imageData === null && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mt-32 space-y-16"
                    >
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-black text-[#F63049] uppercase tracking-tighter">How it works</h2>
                            <p className="text-[#8A244B]/60 font-medium">Simplify your workflow in three easy steps</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { step: "01", title: "Upload your image", desc: "Drag & drop your image or click to browse from your device." },
                                { step: "02", title: "Resize your image", desc: "Enter custom dimensions or choose a preset size instantly." },
                                { step: "03", title: "Download optimized image", desc: "Get your resized image in seconds, ready for web or sharing." }
                            ].map((item, i) => (
                                <div key={i} className="relative p-10 rounded-[40px] bg-[#F63049]/5 border border-[#F63049]/10 group hover:bg-white hover:shadow-2xl hover:shadow-[#F63049]/5 transition-all duration-500">
                                    <span className="absolute top-8 right-10 text-4xl font-black text-[#F63049]/10 group-hover:text-[#F63049]/20 transition-colors">{item.step}</span>
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-black text-[#D02752] uppercase tracking-tight">{item.title}</h3>
                                        <p className="text-[#8A244B]/70 leading-relaxed text-sm font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {imageData === null && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-48 space-y-24"
                    >
                        <div className="text-center space-y-6">
                            <h2 className="text-4xl md:text-5xl font-black text-[#F63049] uppercase tracking-tighter">Why Choose XResizer</h2>
                            <p className="text-lg text-[#8A244B]/60 font-medium max-w-2xl mx-auto">Professional tools designed for everyone. Fast, free, and secure.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {[
                                { icon: Target, title: "No Quality Loss", desc: "Resize images without losing visual clarity or sharpness." },
                                { icon: Zap, title: "Instant Resizing", desc: "Resize your images in seconds with fast local-first processing." },
                                { icon: MousePointer2, title: "Easy To Use", desc: "Upload, resize, and download — it's that simple." },
                                { icon: Globe, title: "Works Anywhere", desc: "Browser-based tool that works on all devices and platforms." },
                                { icon: ShieldCheck, title: "Privacy Guaranteed", desc: "Your images are processed securely and never stored." },
                                { icon: Gift, title: "Completely Free", desc: "No login, no watermark, and no hidden limits." }
                            ].map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -12, scale: 1.02 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                        delay: i * 0.05
                                    }}
                                    className="relative p-10 rounded-[40px] bg-white border border-[#F63049]/10 hover:border-[#F63049]/30 transition-all duration-500 group overflow-hidden"
                                >
                                    {/* Animated Background Highlight */}
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#F63049] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#F63049]/[0.02] rounded-full blur-3xl group-hover:bg-[#F63049]/5 transition-colors duration-700" />

                                    <div className="w-16 h-16 rounded-[24px] bg-[#F63049]/5 flex items-center justify-center text-[#F63049] mb-8 group-hover:scale-110 group-hover:bg-[#F63049] group-hover:text-white transition-all duration-500 shadow-sm relative z-10">
                                        <feature.icon className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-4 relative z-10">
                                        <h3 className="text-xl font-black text-[#D02752] uppercase tracking-tight group-hover:text-[#F63049] transition-colors">{feature.title}</h3>
                                        <p className="text-[#8A244B]/70 text-base leading-relaxed font-medium transition-colors group-hover:text-[#8A244B]">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}
            </main>


        </div>
    );
}

export default Home;
