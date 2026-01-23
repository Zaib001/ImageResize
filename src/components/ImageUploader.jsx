import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, AlertCircle, Maximize2, Shield, Sparkles, RotateCcw, RotateCw, Crop as CropIcon } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageUploader = ({ onUpload, onRemove, externalImage, crop, setCrop, rotation, setRotation }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const [imgDimensions, setImgDimensions] = useState({ naturalWidth: 0, naturalHeight: 0 });
    const lastImageUrlRef = useRef(null);

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 4 * 1024 * 1024; // 4MB

    // Reset crop when a NEW image is uploaded (not when preview updates)
    useEffect(() => {
        if (externalImage?.previewUrl && lastImageUrlRef.current !== externalImage.previewUrl) {
            // Only reset if this is a different image (not just a preview update)
            const isNewImage = !lastImageUrlRef.current ||
                !externalImage.previewUrl.includes('blob:');

            if (isNewImage || lastImageUrlRef.current === null) {
                lastImageUrlRef.current = externalImage.previewUrl;
                // Don't set a default crop - let ReactCrop handle it
                // setCrop(null);
                setRotation(0);
                console.log('New image uploaded, reset rotation');
            }
        }
    }, [externalImage?.previewUrl, setCrop, setRotation]);

    const handleFileChange = (file) => {
        if (!file) return;

        setError(null);

        if (!allowedTypes.includes(file.type)) {
            setError('FORMAT NOT SUPPORTED. PLEASE USE JPEG, PNG, WEBP, OR GIF.');
            return;
        }

        if (file.size > maxSize) {
            setError('PAYLOAD LIMIT EXCEEDED. MAXIMUM FILE SIZE IS 4MB.');
            return;
        }

        const url = URL.createObjectURL(file);

        const img = new Image();
        img.onload = () => {
            setImgDimensions({
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight
            });

            onUpload({
                file,
                previewUrl: url,
                name: file.name,
                size: file.size,
                type: file.type,
                width: img.naturalWidth,
                height: img.naturalHeight
            });

            console.log('Image loaded with dimensions:', {
                width: img.naturalWidth,
                height: img.naturalHeight
            });
        };
        img.onerror = () => {
            setError('FAILED TO READ IMAGE DIMENSIONS.');
            URL.revokeObjectURL(url);
        };
        img.src = url;
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

    // Handle image load to update dimensions
    const onImageLoad = (img) => {
        if (img) {
            console.log('ReactCrop image loaded:', {
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                clientWidth: img.clientWidth,
                clientHeight: img.clientHeight
            });
        }
    };

    // Handle crop change
    const handleCropChange = (_, percentCrop) => {
        // console.log('Crop changed:', percentCrop);
        // Ensure unit is %
        if (!percentCrop.unit) percentCrop.unit = '%';
        setCrop(percentCrop);
    };

    // Handle crop completion
    const handleCropComplete = (_, percentCrop) => {
        // console.log('Crop completed:', percentCrop);
        if (!percentCrop.unit) percentCrop.unit = '%';
        setCrop(percentCrop);
    };

    // Rotate handlers
    const rotateLeft = () => {
        setRotation(prev => (prev - 90) % 360);
    };

    const rotateRight = () => {
        setRotation(prev => (prev + 90) % 360);
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
                            <h2 className="text-4xl font-black text-[#F63049] tracking-[-0.05em] uppercase">Initialize Asset</h2>
                            <p className="text-xs font-black text-[#8A244B]/60 tracking-[0.4em] uppercase">
                                Drop Image or <span className="text-[#F63049]">Locate</span>
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-10">
                            <div className="flex -space-x-4">
                                {['JPG', 'PNG', 'WEBP'].map((ext, i) => (
                                    <div
                                        key={ext}
                                        className="w-14 h-14 rounded-2xl bg-white border border-[#F63049]/10 flex items-center justify-center text-[10px] font-black text-[#8A244B]/60 group-hover:border-[#D02752] transition-all duration-500 shadow-sm"
                                    >
                                        {ext}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#8A244B]/40 group-hover:text-[#F63049]/60 transition-colors">
                                <Shield className="w-4 h-4" />
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
                            <div className="flex justify-center bg-gray-50/50 p-4 min-h-[400px] items-center">
                                <ReactCrop
                                    crop={crop}
                                    onChange={handleCropChange}
                                    onComplete={handleCropComplete}
                                    ruleOfThirds
                                    minWidth={50}
                                    minHeight={50}
                                    keepSelection={true}
                                    style={{ maxHeight: '600px', maxWidth: '100%' }}
                                >
                                    <img
                                        ref={onImageLoad}
                                        src={externalImage.previewUrl}
                                        alt="Preview"
                                        style={{
                                            transform: `rotate(${rotation}deg)`,
                                            maxWidth: '100%',
                                            maxHeight: '600px',
                                            display: 'block',
                                            width: 'auto',
                                            height: 'auto'
                                        }}
                                        className="object-contain"
                                    />
                                </ReactCrop>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-[#F63049]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                            <div className="absolute top-3 sm:top-6 left-3 sm:left-6 flex items-center space-x-2 sm:space-x-3">
                                <div className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur-xl border border-[#D02752]/20 shadow-md">
                                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#F63049] animate-pulse" />
                                    <span className="text-[9px] sm:text-[10px] font-black text-[#D02752] tracking-[0.1em] sm:tracking-[0.2em] uppercase hidden xs:inline">Validated</span>
                                    <span className="text-[9px] sm:text-[10px] font-black text-[#D02752] tracking-[0.1em] sm:tracking-[0.2em] uppercase xs:hidden">✓</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={removeImage}
                                className="absolute top-3 sm:top-6 right-3 sm:right-6 bg-white text-[#F63049] px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl border border-[#F63049]/20 flex items-center space-x-2 sm:space-x-3 hover:bg-[#F63049] hover:text-white transition-all duration-300 z-10"
                            >
                                <X className="w-4 sm:w-5 h-4 sm:h-5" />
                                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider sm:tracking-widest hidden xs:inline">Cancel</span>
                            </motion.button>

                            {/* Crop info overlay */}
                            {crop && crop.width < 100 && (
                                <div className="absolute bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded-lg">
                                    <div>Crop: {Math.round(crop.width)}% x {Math.round(crop.height)}%</div>
                                    <div>Position: {Math.round(crop.x)}%, {Math.round(crop.y)}%</div>
                                </div>
                            )}
                        </div>

                        {/* Toolbar: Rotate & Crop Controls */}
                        <div className="flex flex-wrap items-center justify-center gap-4 py-4 border-b border-[#D02752]/10">
                            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-[#D02752]/10 shadow-sm">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/40 mr-2">Rotate</span>
                                <button
                                    onClick={rotateLeft}
                                    className="p-2 hover:bg-[#F63049]/10 rounded-lg text-[#8A244B] transition-colors"
                                    title="Rotate Left"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={rotateRight}
                                    className="p-2 hover:bg-[#F63049]/10 rounded-lg text-[#8A244B] transition-colors"
                                    title="Rotate Right"
                                >
                                    <RotateCw className="w-4 h-4" />
                                </button>
                                <span className="text-[10px] text-[#8A244B]/60 ml-2">
                                    {((rotation % 360) + 360) % 360}°
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-[#D02752]/10 shadow-sm">
                                <CropIcon className="w-4 h-4 text-[#8A244B]/60" />
                                <span className="text-[10px] font-black text-[#8A244B]/60">
                                    {crop && crop.width < 100
                                        ? `Crop active: ${Math.round(crop.width)}% x ${Math.round(crop.height)}%`
                                        : 'Drag on image to crop'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8 p-4 sm:p-8 bg-white rounded-2xl sm:rounded-[32px] border border-[#D02752]/10 shadow-sm">
                            <div className="flex items-center space-x-4 sm:space-x-8 w-full md:w-auto">
                                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-white border border-[#D02752]/20 rounded-xl sm:rounded-2xl overflow-hidden p-1 shrink-0 group">
                                    <img
                                        src={externalImage.previewUrl}
                                        alt="Thumb"
                                        style={{ transform: `rotate(${rotation}deg)` }}
                                        className="w-full h-full object-cover rounded-lg sm:rounded-xl group-hover:scale-125 transition-transform duration-1000"
                                    />
                                </div>
                                <div className="min-w-0 space-y-2 flex-1">
                                    <p className="text-sm sm:text-lg font-black text-[#F63049] truncate uppercase tracking-tighter">
                                        {externalImage.name}
                                    </p>
                                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                                        <span className="px-2 sm:px-3 py-1 rounded-lg bg-[#D02752]/5 border border-[#D02752]/10 text-[10px] sm:text-[11px] font-black text-[#D02752] uppercase tracking-widest">
                                            {externalImage.type.split('/')[1]}
                                        </span>
                                        <span className="text-[10px] sm:text-[11px] font-black text-[#8A244B]/60 uppercase tracking-[0.2em]">
                                            {externalImage.width} × {externalImage.height} px
                                        </span>
                                        <span className="text-[10px] sm:text-[11px] font-black text-[#8A244B]/60 uppercase tracking-[0.2em]">
                                            {(externalImage.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 sm:space-x-4 text-[9px] sm:text-[10px] font-black text-[#8A244B]/50 uppercase tracking-[0.2em] sm:tracking-[0.4em] bg-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-[#D02752]/5 w-full md:w-auto justify-center shadow-sm">
                                <Maximize2 className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2 text-[#F63049]" />
                                <span className="hidden sm:inline">Local Session Active</span>
                                <span className="sm:hidden">Active</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-6 left-6 right-6 z-50 p-6 bg-[#F63049] text-white text-xs font-black tracking-[0.2em] uppercase rounded-2xl flex items-center justify-between shadow-2xl border border-white/20"
                    >
                        <div className="flex items-center space-x-4">
                            <AlertCircle className="w-5 h-5 text-white" />
                            <p>{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageUploader;
