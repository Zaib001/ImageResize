import React from 'react';
import { motion } from 'framer-motion';
import { Settings2, Maximize, Move, Download, Layout, Palette, Zap, Sparkles } from 'lucide-react';

const ResizeOptions = ({ onResize }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
        >
            <div className="flex items-center justify-between mb-8 sm:mb-12">
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="p-2 sm:p-3 bg-[#F63049] text-white rounded-xl sm:rounded-2xl shadow-lg border border-[#F63049]/20">
                        <Settings2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-black text-[#F63049] uppercase tracking-tighter">Parameters</h3>
                        <p className="text-[8px] sm:text-[9px] font-black text-[#8A244B]/50 uppercase tracking-[0.2em] sm:tracking-[0.3em] hidden xs:block">Neural Config</p>
                    </div>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-[#F63049]/10 flex items-center justify-center">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-[#F63049]/20" />
                </div>
            </div>

            {/* Dimensions Section */}
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[#8A244B]/60">Target Scale</label>
                    <div className="px-2 sm:px-3 py-1 bg-[#F63049]/5 border border-[#F63049]/10 rounded-lg flex items-center space-x-1.5 sm:space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F63049] animate-pulse" />
                        <span className="text-[8px] sm:text-[9px] font-black text-[#D02752] uppercase tracking-wider sm:tracking-widest">Linked</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                        <span className="text-[8px] sm:text-[9px] font-black text-[#8A244B]/40 uppercase tracking-[0.3em] sm:tracking-[0.5em] ml-1">Width</span>
                        <input
                            type="number"
                            placeholder="1920"
                            className="w-full bg-white border border-[#D02752]/20 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm font-black text-[#8A244B] focus:border-[#F63049] focus:ring-2 sm:focus:ring-4 focus:ring-[#F63049]/5 transition-all outline-none placeholder:text-[#8A244B]/20 shadow-sm"
                        />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                        <span className="text-[8px] sm:text-[9px] font-black text-[#8A244B]/40 uppercase tracking-[0.3em] sm:tracking-[0.5em] ml-1">Height</span>
                        <input
                            type="number"
                            placeholder="1080"
                            className="w-full bg-white border border-[#D02752]/20 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm font-black text-[#8A244B] focus:border-[#F63049] focus:ring-2 sm:focus:ring-4 focus:ring-[#F63049]/5 transition-all outline-none placeholder:text-[#8A244B]/20 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Quality Section */}
            <div className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[#8A244B]/60">Quality</label>
                    <span className="text-[9px] sm:text-[10px] font-black text-[#D02752] px-2 sm:px-3 py-1 bg-[#F63049]/5 rounded-lg border border-[#F63049]/10">0.95</span>
                </div>
                <div className="relative pt-2">
                    <input
                        type="range"
                        className="w-full h-[3px] bg-[#F63049]/10 rounded-lg appearance-none cursor-pointer accent-[#F63049]"
                    />
                    <div className="flex justify-between mt-3 sm:mt-4 text-[7px] sm:text-[8px] font-black text-[#8A244B]/50 uppercase tracking-[0.3em] sm:tracking-[0.5em]">
                        <span>LATENCY</span>
                        <span>PRECISION</span>
                    </div>
                </div>
            </div>

            {/* Format Selection */}
            <div className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
                <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[#8A244B]/60 block">Output</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {['JPG', 'PNG', 'WEBP'].map((format) => (
                        <button
                            key={format}
                            className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl border text-[9px] sm:text-[10px] font-black transition-all duration-500 ${format === 'WEBP'
                                ? 'bg-[#F63049] text-white border-[#F63049] shadow-lg'
                                : 'bg-white border-[#D02752]/20 text-[#8A244B]/60 hover:border-[#F63049] hover:text-[#F63049] shadow-sm'
                                }`}
                        >
                            {format}
                        </button>
                    ))}
                </div>
            </div>

            {/* Download Button */}
            <div className="pt-8 sm:pt-12">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#F63049] text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] flex items-center justify-center space-x-3 sm:space-x-4 shadow-xl hover:shadow-2xl transition-all border border-[#F63049]/20 text-[10px] sm:text-[11px]"
                >
                    <Download className="w-4 sm:w-5 h-4 sm:h-5 group-hover:scale-110 transition-transform" />
                    <span>Compile & Export</span>
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
