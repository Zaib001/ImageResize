import React from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import Navbar from '../components/Navbar';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#8A244B] font-sans">
            <Navbar />
            <SEOHead
                title="Terms of Service"
                description="Terms of Service for using Resizely image tools."
                slug="terms"
            />

            <main className="max-w-[1000px] mx-auto px-6 py-20 md:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black text-[#F63049] uppercase tracking-tighter mb-8">Terms of Service</h1>

                    <div className="prose prose-lg prose-rose max-w-none text-[#8A244B]/80">
                        <p className="lead">Last Updated: {new Date().toLocaleDateString()}</p>

                        <h3 className="text-xl font-bold text-[#D02752] mt-8 mb-4 uppercase">1. Terms</h3>
                        <p>
                            By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, all applicable laws and regulations,
                            and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms,
                            you are prohibited from using or accessing this site.
                        </p>

                        <h3 className="text-xl font-bold text-[#D02752] mt-8 mb-4 uppercase">2. Use License</h3>
                        <p>
                            Permission is granted to temporarily download one copy of the materials (information or software) on Resizely's website for personal,
                            non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>modify or copy the materials;</li>
                            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                            <li>attempt to decompile or reverse engineer any software contained on Resizely's website;</li>
                            <li>remove any copyright or other proprietary notations from the materials; or</li>
                            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                        </ul>

                        <h3 className="text-xl font-bold text-[#D02752] mt-8 mb-4 uppercase">3. Disclaimer</h3>
                        <p>
                            The materials on Resizely's website are provided "as is". Resizely makes no warranties, expressed or implied, and hereby disclaims and negates
                            all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose,
                            or non-infringement of intellectual property or other violation of rights.
                        </p>

                        <h3 className="text-xl font-bold text-[#D02752] mt-8 mb-4 uppercase">4. Limitations</h3>
                        <p>
                            In no event shall Resizely or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
                            or due to business interruption,) arising out of the use or inability to use the materials on Resizely's website.
                        </p>

                        <h3 className="text-xl font-bold text-[#D02752] mt-8 mb-4 uppercase">5. Revisions and Errata</h3>
                        <p>
                            The materials appearing on Resizely's website could include technical, typographical, or photographic errors.
                            Resizely does not warrant that any of the materials on its website are accurate, complete, or current.
                        </p>

                        <h3 className="text-xl font-bold text-[#D02752] mt-8 mb-4 uppercase">6. Links</h3>
                        <p>
                            Resizely has not reviewed all of the sites linked to its Internet web site and is not responsible for the contents of any such linked site.
                            The inclusion of any link does not imply endorsement by Resizely of the site. Use of any such linked web site is at the user's own risk.
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default TermsOfService;
