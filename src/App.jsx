import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Image, Zap, Shield, Sparkles, ChevronRight, LayoutGrid, Cpu, Globe, Menu, X, ArrowDown } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import ResizeOptions from './components/ResizeOptions';
import { useEffect, useRef } from 'react';
import { api } from './services/api';
import 'react-image-crop/dist/ReactCrop.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [crop, setCrop] = useState(null);
  const [rotation, setRotation] = useState(0);
  const lastOptionsRef = useRef({});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
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

    // Cache options for when crop/rotate changes
    if (options) {
      lastOptionsRef.current = { ...lastOptionsRef.current, ...options };
    }
    const currentOptions = { ...lastOptionsRef.current, ...options };

    // Don't update preview if only crop or rotation changed
    // This prevents the image from bouncing/reloading while user is cropping
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

    // Skip preview update if only crop/rotation changed
    if (!paramsChanged && lastPreviewParamsRef.current !== null) {
      return;
    }

    lastPreviewParamsRef.current = previewParams;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (currentOptions.width && currentOptions.height) {
      try {
        const formData = new FormData();
        formData.append('image', imageData.file);
        formData.append('width', currentOptions.width);
        formData.append('height', currentOptions.height);
        formData.append('unit', currentOptions.unit || 'px');
        formData.append('mode', currentOptions.mode || 'stretch');
        formData.append('isPreview', 'true');

        // Don't send crop/rotation to preview - only apply on final download
        // This keeps the preview stable while cropping

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
          previewSize: blob.size // Store the size of the preview
        }));
      } catch (err) {
        if (err.name === 'CanceledError' || err.name === 'AbortError' || axios.isCancel(err) || err.code === 'ERR_CANCELED') {
          return;
        }
        console.error("Preview update failed", err);
      }
    }
  };

  const handleRemoveImage = () => {
    setImageData(null);
  };



  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imageData?.previewUrl) {
        URL.revokeObjectURL(imageData.previewUrl);
      }
    };
  }, [imageData]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#8A244B] selection:bg-[#F63049]/10 font-sans overflow-x-hidden">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Mesh Gradient Backgrounds */}
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
        <motion.div
          animate={{
            translate: ['0% 0%', '20% 10%', '0% 0%'],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="premium-blur top-[30%] right-[10%] w-[40%] h-[40%] bg-[#8A244B] opacity-[0.015]"
        />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="glass-nav bg-transparent transition-colors duration-500 px-4 md:px-12 py-5"
      >
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-4 cursor-pointer z-[60]"
          >
            <div className="w-10 h-10 bg-[#F63049]/5 rounded-2xl flex items-center justify-center border border-[#F63049]/10 shadow-sm">
              <Image className="w-6 h-6 text-[#F63049]" />
            </div>
            <span className="text-2xl font-black tracking-[-0.05em] text-[#F63049]">
              RESIZELY<span className="text-[#F63049]/20 truncate hidden sm:inline">.CORE</span>
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-12">
            {['Engine', 'Privacy', 'Enterprise'].map((item) => (
              <a key={item} href="#" className="text-xs font-black uppercase tracking-[0.3em] text-[#8A244B]/70 hover:text-[#F63049] transition-all duration-300 relative group">
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#F63049] group-hover:w-full transition-all duration-500" />
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-3 sm:space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest bg-[#F63049] text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Start Session
            </motion.button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[#8A244B]/50 hover:text-[#F63049] transition-colors z-[60]"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <motion.div
          initial={false}
          animate={isMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 bg-[#F9F8F6]/95 backdrop-blur-2xl z-50 md:hidden flex flex-col justify-center px-12"
        >
          <div className="space-y-12">
            {['Engine', 'Privacy', 'Enterprise'].map((item, i) => (
              <motion.a
                key={item}
                initial={{ opacity: 0, x: 20 }}
                animate={isMenuOpen ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                href="#"
                onClick={() => setIsMenuOpen(false)}
                className="block text-6xl font-black uppercase tracking-tighter text-[#F63049]/10 hover:text-[#F63049] transition-all duration-500"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.nav>

      <main
        className="relative max-w-[1400px] min-h-[80vh] mx-auto px-6 py-12 md:py-24"
      >
        {/* Hero Section */}
        <AnimatePresence mode="wait">
          {imageData === null && (
            <motion.div
              key="hero-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center mb-32 space-y-12"
            >
              <div className="inline-flex items-center space-x-3 px-6 py-2 rounded-full bg-[#F63049]/5 border border-[#F63049]/10 backdrop-blur-md mb-4 animate-float">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F63049] animate-pulse" />
                <span className="text-[11px] font-black tracking-[0.3rem] uppercase text-[#F63049]/80">Professional Mode</span>
              </div>

              <h1 className="text-[12vw] sm:text-8xl md:text-[10rem] font-black text-[#F63049] tracking-[-0.07em] leading-[0.8] uppercase flex flex-col items-center">
                <span className="relative">
                  Precision
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.4, duration: 1, ease: "circOut" }}
                    className="absolute -bottom-4 left-0 h-4 bg-[#F63049]/10 skew-x-[-20deg]"
                  />
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F63049] to-[#D02752] translate-y-[-10%]">Imaging.</span>
              </h1>

              <div className="max-w-2xl mx-auto space-y-8">
                <p className="text-xl md:text-2xl text-[#8A244B]/80 font-medium leading-relaxed tracking-tight">
                  High-performance image synthesis and manipulation platform. <br />
                  Engineered with corporate-grade security for enterprise assets.
                </p>

                <div className="flex flex-col items-center space-y-4 pt-12">
                  <div className="w-px h-16 bg-gradient-to-b from-[#D02752]/30 to-transparent" />
                  <span className="text-[10px] font-black tracking-[0.5em] text-[#8A244B]/40 uppercase">Initialize Core</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Uploader Section - Resizable Grid */}
        <motion.div
          variants={itemVariants}
          layout
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`grid grid-cols-1 ${imageData ? 'lg:grid-cols-12' : 'grid-cols-1'} gap-8 md:gap-20 items-stretch h-full`}
        >
          {/* Left Side: Uploader/Preview */}
          <motion.div
            layout
            className={`relative group h-full ${imageData ? 'lg:col-span-7 xl:col-span-8' : 'w-full max-w-4xl mx-auto'}`}
          >
            <div className="absolute -inset-4 bg-white/5 rounded-[48px] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000 pointer-events-none" />
            <motion.div
              layout
              className={`glass-card h-full ${imageData ? 'p-4 md:p-8' : 'p-4 md:p-12'} rounded-[40px]`}
            >
              <ImageUploader
                onUpload={handleImageUpload}
                onRemove={handleRemoveImage}
                externalImage={imageData}
                crop={crop}
                setCrop={setCrop}
                rotation={rotation}
                setRotation={setRotation}
              />
            </motion.div>
          </motion.div>
          {/* Right Side: Options Panel */}
          <AnimatePresence>
            {imageData && (
              <motion.div
                initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32 h-fit mb-24 lg:mb-0"
              >
                <div className="glass-card p-8 md:p-10 rounded-[40px] border border-white/5 h-full">
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

        {/* Features Grid */}
        <AnimatePresence>
          {imageData === null && (
            <motion.div
              key="features-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24 px-4 md:px-0"
            >
              {[
                { icon: Zap, title: "Neural Warp", desc: "Proprietary upscaling algorithms optimized for precision." },
                { icon: Shield, title: "Secure Core", desc: "Enterprise-grade data isolation and ephemeral processing." },
                { icon: LayoutGrid, title: "Parallel Engine", desc: "High-throughput batch processing for rapid deployment." }
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -10 }}
                  className="space-y-8"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#F63049]/5 border border-[#F63049]/10 flex items-center justify-center text-[#F63049] shadow-sm">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-black tracking-tight text-[#D02752] uppercase">{feature.title}</h3>
                    <p className="text-[#8A244B]/70 text-base leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={itemVariants}
          className={`${imageData ? 'mt-40' : 'mt-64'} pt-32 border-t border-[#D02752]/10 transition-all duration-1000`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-16">
            <div className="text-xs font-black tracking-[0.8em] text-[#8A244B]/40 uppercase vertical-text hidden md:block select-none">ARCHITECTURE</div>
            <div className="flex-1 flex flex-wrap justify-center gap-12 md:gap-32 opacity-30 grayscale hover:opacity-100 transition-opacity duration-700">
              {['Meta', 'Stripe', 'SpaceX', 'OpenAI'].map((brand) => (
                <span key={brand} className="text-3xl font-black tracking-tighter uppercase whitespace-nowrap italic text-[#D02752]">{brand}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="relative py-24 px-6 md:px-12 mt-40 border-t border-[#D02752]/10 bg-transparent">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <span className="text-2xl font-black tracking-tighter uppercase text-[#F63049]">RESIZELY</span>
            <p className="text-[11px] font-bold tracking-[0.3em] text-[#8A244B]/40 uppercase">Version 4.3.0 Berry Edition</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-[11px] font-black uppercase tracking-[0.4em] text-[#8A244B]/70">
            {['Security', 'Documentation', 'Status'].map(link => (
              <a key={link} href="#" className="hover:text-[#F63049] transition-colors duration-500">{link}</a>
            ))}
          </div>

          <div className="flex flex-col items-center md:items-end space-y-2">
            <p className="text-[11px] font-black tracking-[0.2em] text-[#8A244B]/20 uppercase">
              RESIZELY TECHNOLOGY GROUP © 2026
            </p>
            <div className="flex space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F63049] shadow-[0_0_10px_rgba(246,48,73,0.5)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#F63049]/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#F63049]/20" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;