import React from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import Navbar from '../components/Navbar';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#8A244B] font-sans">
            <Navbar />
            <SEOHead
                title="Terms of Service - xResizer"
                description="Terms of service for using xResizer image resizer and compressor tool. User responsibilities and usage guidelines explained."
                slug="terms"
            />

            <main className="max-w-[1000px] mx-auto px-6 py-20 md:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black text-[#F63049] uppercase tracking-tighter mb-8">Terms of Service</h1>

                    <div className="prose prose-lg prose-rose max-w-none text-[#8A244B]/80 font-medium">
                        <p className="lead">Last Updated: {new Date().toLocaleDateString()}</p>

                        <h3 className="text-xl font-black text-[#D02752] mt-8 mb-4 uppercase tracking-tight">1. Terms</h3>
                        <p>
                            By accessing xResizer, you are agreeing to be bound by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>

                        <h3 className="text-xl font-black text-[#D02752] mt-8 mb-4 uppercase tracking-tight">2. Use License & Restrictions</h3>
                        <p>
                            Permission is granted to use xResizer for personal and commercial image resizing. However, you are strictly prohibited from:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Misusing the service using automated bots, scripts, or excessive API calls.</li>
                            <li>Attempting to reverse engineer any software contained on xResizer's website.</li>
                            <li>Using the service for illegal activities or to process copyrighted material you do not own.</li>
                        </ul>

                        <h3 className="text-xl font-black text-[#D02752] mt-8 mb-4 uppercase tracking-tight">3. User Responsibility & Liability</h3>
                        <p>
                            <strong>Content Liability:</strong> You are fully responsible for the images and files you upload, convert, or download using this website. xResizer acts solely as a processing tool and claims no ownership over user content.
                        </p>
                        <p>
                            <strong>Copyright Disclaimer:</strong> xResizer is not responsible for any copyrighted content processed by users. You must ensure you have the necessary rights to edit or convert any files you upload.
                        </p>

                        <h3 className="text-xl font-black text-[#D02752] mt-8 mb-4 uppercase tracking-tight">4. Data Handling & Security</h3>
                        <p>
                            <strong>Temporary Storage:</strong> xResizer does not store images permanently. All files are processed temporarily in memory and are automatically deleted from our servers within 60 minutes.
                        </p>

                        <h3 className="text-xl font-black text-[#D02752] mt-8 mb-4 uppercase tracking-tight">5. Service Availability</h3>
                        <p>
                            We strive for high uptime but do not guarantee uninterrupted or error-free service at all times. xResizer is provided "as is," and we reserve the right to modify or discontinue features without notice.
                        </p>

                        <h3 className="text-xl font-black text-[#D02752] mt-8 mb-4 uppercase tracking-tight">6. Limitations</h3>
                        <p>
                            In no event shall xResizer or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the materials on xResizer's website.
                        </p>

                        <h3 className="text-xl font-black text-[#D02752] mt-8 mb-4 uppercase tracking-tight">7. Contact & Support</h3>
                        <p>
                            For any concerns regarding these terms or service issues, please contact our support team directly:
                        </p>
                        <p className="text-[#F63049] font-bold">
                            Email: <a href="mailto:support@xresizer.com" className="hover:underline">support@xresizer.com</a>
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default TermsOfService;
