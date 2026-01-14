import React from 'react';
import { motion } from 'framer-motion';
import { Image, Zap, Shield, Sparkles, ChevronRight, LayoutGrid, Cpu, Globe } from 'lucide-react';
import ImageUploader from './components/ImageUploader';

function App() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      {/* Mesh Gradient Backgrounds */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            translate: ['0% 0%', '10% -10%', '0% 0%'],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]"
        />
        <motion.div
          animate={{
            translate: ['0% 0%', '-5% 10%', '0% 0%'],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-fuchsia-500/10 blur-[120px]"
        />
        <motion.div
          animate={{
            translate: ['0% 0%', '15% 5%', '0% 0%'],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[10%] w-[35%] h-[35%] rounded-full bg-violet-500/10 blur-[120px]"
        />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="glass-nav px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20"
            >
              <Image className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              RESIZELY
            </span>
          </div>

          <div className="hidden md:flex space-x-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
            {['Tools', 'Accuracy', 'API'].map((item) => (
              <a key={item} href="#" className="hover:text-white transition-colors duration-300 relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glow-button px-7 py-2.5 rounded-full text-xs font-black uppercase tracking-widest"
          >
            Get Pro Access
          </motion.button>
        </div>
      </motion.nav>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-5xl mx-auto px-6 py-20"
      >
        {/* Hero Section */}
        <div className="text-center mb-24 space-y-8">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 shadow-xl"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-indigo-300">Neural Engine v4.0 Active</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-9xl font-black text-white tracking-tight leading-[0.85] uppercase"
          >
            <motion.span
              animate={{
                y: [0, -15, 0],
                textShadow: [
                  "0 0 0px rgba(99,102,241,0)",
                  "0 0 20px rgba(99,102,241,0.3)",
                  "0 0 0px rgba(99,102,241,0)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              Advanced
            </motion.span>
            <br />
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="gradient-text bg-[length:200%_auto] inline-block"
            >
              Processing.
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium tracking-tight"
          >
            Industry-leading image synthesis and resizing. <br className="hidden md:block" />
            Military-grade encryption with zero-latency preview.
          </motion.p>
        </div>

        {/* Uploader Section */}
        <motion.div
          variants={itemVariants}
          className="relative group perspective-1000"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 rounded-[40px] blur-2xl opacity-10 group-hover:opacity-25 transition duration-1000" />
          <div className="relative bg-[#0d121f]/90 backdrop-blur-3xl p-4 md:p-10 rounded-[32px] border border-white/[0.08] shadow-2xl">
            <ImageUploader />
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-16">
          {[
            { icon: Zap, title: "HyperScale API", desc: "Global edge CDN delivery in under 40ms." },
            { icon: Shield, title: "Private Vault", desc: "No data logging. Ever. Your assets are ephemeral." },
            { icon: LayoutGrid, title: "Batch Processing", desc: "Resize thousands of assets simultaneously." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-white uppercase">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          variants={itemVariants}
          className="mt-40 pt-20 border-t border-white/5"
        >
          <p className="text-center text-[9px] uppercase tracking-[0.5em] font-black text-slate-600 mb-16">
            Pioneering speed for
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-20 grayscale">
            {['Meta', 'Stripe', 'OpenAI', 'SpaceX'].map((brand) => (
              <span key={brand} className="text-2xl font-black tracking-tighter uppercase">{brand}</span>
            ))}
          </div>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <footer className="relative py-24 px-6 mt-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">RESIZELY</span>
          </div>
          <div className="flex space-x-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            {['Privacy', 'Legal', 'Infrastructure'].map(link => (
              <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>
            ))}
          </div>
          <p className="text-[10px] font-black tracking-[0.2em] text-slate-700 uppercase">
            © 2026 RESIZELY CORP. ALL SYSTEMS OPERATIONAL.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;