import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Download, Zap, Sparkles, HardDrive, Printer, Info } from 'lucide-react';
import { api } from '../services/api';

const ResizeOptions = ({ onResize, imageFile, initialDimensions, previewSize, crop, rotation }) => {
    const [width, setWidth] = useState(1920);
    const [height, setHeight] = useState(1080);
    const [unit, setUnit] = useState('px');
    const [mode, setMode] = useState('stretch');
    const [format, setFormat] = useState('jpeg');
    const [quality, setQuality] = useState(90);
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const [maxSizeKB, setMaxSizeKB] = useState(null);
    const [resolutionMode, setResolutionMode] = useState('auto');
    const [dpi, setDpi] = useState(300);
    const [isProcessing, setIsProcessing] = useState(false);

    const lastImageName = React.useRef(imageFile?.name);

    // Sync state with initialDimensions
    useEffect(() => {
        if (imageFile?.name !== lastImageName.current) {
            lastImageName.current = imageFile?.name;
            if (initialDimensions?.width && initialDimensions?.height) {
                setWidth(initialDimensions.width);
                setHeight(initialDimensions.height);
            }
        }
    }, [initialDimensions, imageFile]);

    // Removed auto-sync to prevent bouncing - users have manual control

    // Unified debounce for ALL parameters
    useEffect(() => {
        const timer = setTimeout(() => {
            onResize({
                width, height, unit, mode, format,
                quality, backgroundColor, maxSizeKB,
                resolutionMode, dpi, crop, rotation
            });
        }, 500);
        return () => clearTimeout(timer);
    }, [
        width, height, unit, mode, format,
        quality, backgroundColor, maxSizeKB,
        resolutionMode, dpi, crop, rotation
    ]);

    const handleDownload = async () => {
        if (!imageFile) {
            alert('Please upload an image first');
            return;
        }

        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('width', width);
            formData.append('height', height);
            formData.append('unit', unit);
            formData.append('mode', mode);
            formData.append('format', format);
            formData.append('quality', quality);
            formData.append('backgroundColor', backgroundColor);
            if (maxSizeKB) formData.append('maxSizeKB', maxSizeKB);
            formData.append('resolutionMode', resolutionMode);
            formData.append('dpi', dpi);

            // Add Crop and Rotate with proper validation
            if (crop && crop.width > 0 && crop.height > 0) {
                formData.append('crop', JSON.stringify(crop));
            } else {
                console.log('No crop applied or full image selected');
            }

            if (rotation && rotation % 360 !== 0) {
                formData.append('rotate', rotation);
                console.log('Rotation applied:', rotation, 'degrees');
            }

            console.log('Starting download process...');
            const startTime = Date.now();

            const blob = await api.processImage(formData);

            const endTime = Date.now();
            console.log(`Download processed in ${endTime - startTime}ms`);
            console.log(`Downloaded file size: ${Math.round(blob.size / 1024)} KB`);

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `processed-image.${format === 'pdf' ? 'pdf' : format}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            alert(`✅ Download complete!\nSize: ${Math.round(blob.size / 1024)} KB`);

        } catch (err) {
            console.error("Download failed", err);
            alert(`❌ Download failed: ${err.message}`);
        } finally {
            setIsProcessing(false);
        }
    };
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 sm:mb-12">
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="p-2 sm:p-3 bg-[#F63049] text-white rounded-xl sm:rounded-2xl shadow-lg border border-[#F63049]/20">
                        <Settings2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#F63049] uppercase tracking-tighter">Parameters</h3>
                        <p className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-[#8A244B]/50 uppercase tracking-[0.2em] sm:tracking-[0.3em] hidden xs:block">Neural Config</p>
                    </div>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-[#F63049]/10 flex items-center justify-center">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-[#F63049]/20" />
                </div>
            </div>

            {/* Dimensions Section */}
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[#8A244B]/60">Target Scale</label>

                    <div className="flex bg-[#F63049]/5 p-1 rounded-lg border border-[#F63049]/10">
                        {['px', 'in', 'cm', 'mm'].map((u) => (
                            <button
                                key={u}
                                onClick={() => {
                                    const currentDpi = resolutionMode === 'auto' ? (['in', 'cm', 'mm'].includes(u) ? 300 : 96) : dpi;
                                    const baseDpi = resolutionMode === 'auto' ? (['in', 'cm', 'mm'].includes(unit) ? 300 : 96) : dpi;

                                    const safeWidth = Number(width) || 0;
                                    const safeHeight = Number(height) || 0;

                                    let pxWidth = safeWidth;
                                    let pxHeight = safeHeight;

                                    if (unit === 'in') {
                                        pxWidth = safeWidth * baseDpi;
                                        pxHeight = safeHeight * baseDpi;
                                    }
                                    else if (unit === 'cm') {
                                        pxWidth = (safeWidth / 2.54) * baseDpi;
                                        pxHeight = (safeHeight / 2.54) * baseDpi;
                                    }
                                    else if (unit === 'mm') {
                                        pxWidth = (safeWidth / 25.4) * baseDpi;
                                        pxHeight = (safeHeight / 25.4) * baseDpi;
                                    }

                                    let newWidth = pxWidth;
                                    let newHeight = pxHeight;

                                    if (u === 'in') {
                                        newWidth = pxWidth / currentDpi;
                                        newHeight = pxHeight / currentDpi;
                                    }
                                    else if (u === 'cm') {
                                        newWidth = (pxWidth / currentDpi) * 2.54;
                                        newHeight = (pxHeight / currentDpi) * 2.54;
                                    }
                                    else if (u === 'mm') {
                                        newWidth = (pxWidth / currentDpi) * 25.4;
                                        newHeight = (pxHeight / currentDpi) * 25.4;
                                    }

                                    setUnit(u);
                                    setWidth(Number(newWidth.toFixed(u === 'px' ? 0 : 2)));
                                    setHeight(Number(newHeight.toFixed(u === 'px' ? 0 : 2)));
                                }}
                                className={`px-2 py-1 text-[8px] font-black uppercase rounded-md transition-all ${unit === u ? 'bg-[#F63049] text-white shadow-sm' : 'text-[#D02752] hover:bg-[#F63049]/10'}`}
                            >
                                {u}
                            </button>
                        ))}
                    </div>

                    <div className="px-2 sm:px-3 py-1 bg-[#F63049]/5 border border-[#F63049]/10 rounded-lg flex items-center space-x-1.5 sm:space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F63049] animate-pulse" />
                        <span className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-[#D02752] uppercase tracking-wider sm:tracking-widest">Linked</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                        <span className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-[#8A244B]/40 uppercase tracking-[0.3em] sm:tracking-[0.5em] ml-1">Width</span>
                        <input
                            type="number"
                            step={unit === 'px' ? "1" : "0.01"}
                            placeholder="1920"
                            value={width}
                            onChange={(e) => setWidth(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full bg-white border border-[#D02752]/20 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-black text-[#8A244B] focus:border-[#F63049] focus:ring-2 sm:focus:ring-4 focus:ring-[#F63049]/5 transition-all outline-none placeholder:text-[#8A244B]/20 shadow-sm"
                        />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                        <span className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-[#8A244B]/40 uppercase tracking-[0.3em] sm:tracking-[0.5em] ml-1">Height</span>
                        <input
                            type="number"
                            step={unit === 'px' ? "1" : "0.01"}
                            placeholder="1080"
                            value={height}
                            onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full bg-white border border-[#D02752]/20 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-black text-[#8A244B] focus:border-[#F63049] focus:ring-2 sm:focus:ring-4 focus:ring-[#F63049]/5 transition-all outline-none placeholder:text-[#8A244B]/20 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Resize Mode Section */}
            <div className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
                <label className="text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[#8A244B]/60 block">Resize Mode</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {['Stretch', 'Blur', 'Color'].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m.toLowerCase())}
                            className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl border text-[10px] sm:text-[11px] md:text-xs font-black transition-all duration-500 ${mode === m.toLowerCase()
                                ? 'bg-[#F63049] text-white border-[#F63049] shadow-lg'
                                : 'bg-white border-[#D02752]/20 text-[#8A244B]/60 hover:border-[#F63049] hover:text-[#F63049] shadow-sm'
                                }`}
                        >
                            {m.toUpperCase()}
                        </button>
                    ))}
                </div>

                {mode === 'color' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex items-center space-x-4 pt-2"
                    >
                        <div className="relative group">
                            <input
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="w-10 h-10 rounded-xl border border-[#D02752]/20 cursor-pointer overflow-hidden"
                            />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/60">Background Color</span>
                    </motion.div>
                )}
            </div>

            {/* Resolution Section */}
            <div className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
                <div className="flex items-center space-x-2">
                    <label className="text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[#8A244B]/60 block">Resolution</label>
                    <div className="group relative">
                        <Info className="w-3 h-3 text-[#8A244B]/40 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#8A244B] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 z-10">
                            Auto selects best DPI for print (300) or screen (96). Fixed allows manual DPI control.
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                        onClick={() => setResolutionMode('auto')}
                        className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl border text-[10px] sm:text-[11px] md:text-xs font-black transition-all duration-500 flex items-center justify-center space-x-2 ${resolutionMode === 'auto'
                            ? 'bg-[#F63049] text-white border-[#F63049] shadow-lg'
                            : 'bg-white border-[#D02752]/20 text-[#8A244B]/60 hover:border-[#F63049] hover:text-[#F63049] shadow-sm'
                            }`}
                    >
                        <Zap className="w-3 h-3" />
                        <span>AUTO</span>
                    </button>
                    <button
                        onClick={() => setResolutionMode('fixed')}
                        className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl border text-[10px] sm:text-[11px] md:text-xs font-black transition-all duration-500 flex items-center justify-center space-x-2 ${resolutionMode === 'fixed'
                            ? 'bg-[#F63049] text-white border-[#F63049] shadow-lg'
                            : 'bg-white border-[#D02752]/20 text-[#8A244B]/60 hover:border-[#F63049] hover:text-[#F63049] shadow-sm'
                            }`}
                    >
                        <Printer className="w-3 h-3" />
                        <span>FIXED</span>
                    </button>
                </div>

                {resolutionMode === 'fixed' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-2"
                    >
                        <div className="flex items-center space-x-3">
                            <input
                                type="number"
                                placeholder="DPI"
                                value={dpi}
                                onChange={(e) => setDpi(Number(e.target.value))}
                                className="w-full bg-white border border-[#D02752]/20 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-black text-[#8A244B] focus:border-[#F63049] focus:ring-2 sm:focus:ring-4 focus:ring-[#F63049]/5 transition-all outline-none placeholder:text-[#8A244B]/20 shadow-sm"
                            />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/60">DPI</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Quality Section */}
            <div className={`space-y-4 sm:space-y-6 pt-3 sm:pt-4 ${maxSizeKB ? 'opacity-50 pointer-events-none grayscale' : ''} transition-all duration-300`}>
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <label className="text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[#8A244B]/60">Quality</label>
                    <span className="text-[10px] sm:text-[11px] md:text-xs font-black text-[#D02752] px-2 sm:px-3 py-1 bg-[#F63049]/5 rounded-lg border border-[#F63049]/10">
                        {maxSizeKB ? 'AUTO' : `${quality}%`}
                    </span>
                </div>
                <div className="relative pt-2">
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full h-[3px] bg-[#F63049]/10 rounded-lg appearance-none cursor-pointer accent-[#F63049]"
                        disabled={!!maxSizeKB}
                    />
                    <div className="flex justify-between mt-3 sm:mt-4 text-[8px] sm:text-[9px] font-black text-[#8A244B]/50 uppercase tracking-[0.3em] sm:tracking-[0.5em]">
                        <span>LATENCY</span>
                        <span>PRECISION</span>
                    </div>
                    {maxSizeKB && (
                        <div className="absolute inset-x-0 -bottom-6 text-center">
                            <span className="text-[9px] font-black text-[#F63049] uppercase tracking-widest bg-white/80 px-2 py-1 rounded">
                                Optimized for Size
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Max File Size Section */}
            <div className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
                <div className="flex justify-between items-center text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[#8A244B]/60">
                    <label>Max File Size</label>
                    {previewSize && (
                        <span className="text-[#F63049] flex items-center gap-2">
                            <span className="opacity-50">EST:</span>
                            {(previewSize / 1024).toFixed(1)} KB
                        </span>
                    )}
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                        { label: 'Unlimited', value: null },
                        { label: '50 KB', value: 50 },
                        { label: '100 KB', value: 100 },
                        { label: '200 KB', value: 200 },
                        { label: '500 KB', value: 500 },
                        { label: '1 MB', value: 1000 },
                    ].map((opt) => (
                        <button
                            key={opt.label}
                            onClick={() => setMaxSizeKB(opt.value)}
                            className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl border text-[10px] sm:text-[11px] md:text-xs font-black transition-all duration-500 ${maxSizeKB === opt.value
                                ? 'bg-[#F63049] text-white border-[#F63049] shadow-lg'
                                : 'bg-white border-[#D02752]/20 text-[#8A244B]/60 hover:border-[#F63049] hover:text-[#F63049] shadow-sm'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <div className="relative group">
                    <input
                        type="number"
                        placeholder="Custom (KB)"
                        value={maxSizeKB || ''}
                        onChange={(e) => setMaxSizeKB(e.target.value ? Number(e.target.value) : null)}
                        className="w-full bg-white border border-[#D02752]/20 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-black text-[#8A244B] focus:border-[#F63049] focus:ring-2 sm:focus:ring-4 focus:ring-[#F63049]/5 transition-all outline-none placeholder:text-[#8A244B]/20 shadow-sm"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <HardDrive className="w-4 h-4 text-[#F63049]/40" />
                    </div>
                </div>
            </div>

            {/* Format Selection */}
            <div className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
                <label className="text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[#8A244B]/60 block">Output</label>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {['JPG', 'PNG', 'WEBP', 'PDF'].map((fmt) => (
                        <button
                            key={fmt}
                            onClick={() => setFormat(fmt.toLowerCase() === 'jpg' ? 'jpeg' : fmt.toLowerCase())}
                            className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl border text-[10px] sm:text-[11px] md:text-xs font-black transition-all duration-500 ${(format === 'jpeg' && fmt === 'JPG') || format === fmt.toLowerCase()
                                ? 'bg-[#F63049] text-white border-[#F63049] shadow-lg'
                                : 'bg-white border-[#D02752]/20 text-[#8A244B]/60 hover:border-[#F63049] hover:text-[#F63049] shadow-sm'
                                }`}
                        >
                            {fmt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Download Button */}
            <div className="pt-8 sm:pt-12">
                <motion.button
                    onClick={handleDownload}
                    disabled={isProcessing || !imageFile}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full bg-[#F63049] text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] flex items-center justify-center space-x-3 sm:space-x-4 shadow-xl hover:shadow-2xl transition-all border border-[#F63049]/20 text-[11px] sm:text-xs md:text-sm ${isProcessing || !imageFile ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    <Download className={`w-4 sm:w-5 h-4 sm:h-5 group-hover:scale-110 transition-transform ${isProcessing ? 'animate-bounce' : ''}`} />
                    <span>{isProcessing ? 'Processing...' : 'Compile & Export'}</span>
                </motion.button>
                <div className="mt-6 sm:mt-8 flex items-center justify-center space-x-3 opacity-20">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#F63049] to-transparent" />
                    <Sparkles className="w-3 h-3 shrink-0 text-[#F63049]" />
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#F63049] to-transparent" />
                </div>
            </div>
        </motion.div>
    );
};

export default ResizeOptions;
