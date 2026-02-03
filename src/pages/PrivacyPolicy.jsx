import React from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import Navbar from '../components/Navbar';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#8A244B] font-sans">
            <Navbar />
            <SEOHead
                title="Privacy Policy"
                description="Privacy Policy for XResizer - Learn how we protect your data."
                slug="privacy"
            />

            <main className="max-w-[1000px] mx-auto px-6 py-20 md:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black text-[#F63049] uppercase tracking-tighter mb-8">Privacy Policy</h1>

                    <div className="prose prose-lg prose-rose max-w-none text-[#8A244B]/80 font-medium">
                        <p className="lead">Effective Date: {new Date().toLocaleDateString()}</p>

                        <h3 className="text-xl font-black text-[#D02752] mt-8 mb-4 uppercase tracking-tight">1. Introduction</h3>
                        <p>
                            Welcome to xResizer ("we," "our," or "us"). We are committed to protecting your privacy and ensuring transparency in how we handle your data. This Privacy Policy specifically outlines our practices regarding data collection, processing, and storage when using our free image resizing tool.
                        </p>

                        <h3 className="text-xl font-black text-[#D02752] mt-8 mb-4 uppercase tracking-tight">2. Information We Collect</h3>
                        <p>
                            <strong>Uploaded Images & Processing:</strong>
                            <br />
                            Images uploaded to xResizer are processed temporarily for the sole purpose of resizing and optimization.
                            <strong> We do not permanently store your images.</strong> All processed files are automatically deleted from our servers within <strong>60 minutes</strong> after processing. We strictly respect your privacy—your photos are never sold, shared, or used for training AI models.
                        </p>
                        <p>
                            <strong>Usage Data & Analytics:</strong>
                            <br />
                            We use <strong>Google Analytics (GA4)</strong> to collect anonymous usage data. This helps us understand how the tool is used (e.g., popular screen sizes, browser types, session duration) to improve performance. This data does not quantify personally identifiable information.
                        </p>

                        <h3 className="text-xl font-black text-[#D02752] mt-8 mb-4 uppercase tracking-tight">3. Cookies & Tracking Technologies</h3>
                        <p>
                            <strong>Google Services:</strong>
                            <br />
                            We use cookies served by Google Analytics and other Google services to analyze traffic and improve user experience. These third-party cookies process data such as your IP address and browsing behavior.
                        </p>
                        <p>
                            <strong>Advertising Disclosure:</strong>
                            <br />
                            We may use third-party advertising services (e.g., Google AdSense) in the future, which may use cookies to serve ads based on your prior visits to our website or other websites.
                        </p>
                        <p>
                            <strong>User Consent & Control:</strong>
                            <br />
                            Cookies are only activated after you provide consent via our cookie consent banner. You retain full control over your data usage:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You can withdraw consent at any time.</li>
                            <li>You can disable cookies directly through your browser settings.</li>
                        </ul>

                        <h3 className="text-xl font-black text-[#D02752] mt-8 mb-4 uppercase tracking-tight">4. Data Security</h3>
                        <p>
                            We employ standard security protocols (HTTPS/SSL) to encrypt data during transmission. While we implement strict temporary storage policies (automatic 60-minute deletion), please note that no method of transmission over the Internet is 100% secure.
                        </p>

                        <h3 className="text-xl font-black text-[#D02752] mt-8 mb-4 uppercase tracking-tight">5. Contact Us</h3>
                        <p>
                            If you have specific questions about our privacy practices, data handling, or wish to exercise your rights, please contact us directly:
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

export default PrivacyPolicy;
