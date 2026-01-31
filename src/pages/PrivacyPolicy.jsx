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
                description="Privacy Policy for Resizely - Learn how we protect your data."
                slug="privacy"
            />

            <main className="max-w-[1000px] mx-auto px-6 py-20 md:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black text-[#F63049] uppercase tracking-tighter mb-8">Privacy Policy</h1>

                    <div className="prose prose-lg prose-rose max-w-none text-[#8A244B]/80">
                        <p className="lead">Effective Date: {new Date().toLocaleDateString()}</p>

                        <h3 className="text-xl font-bold text-[#D02752] mt-8 mb-4 uppercase">1. Introduction</h3>
                        <p>
                            Welcome to Resizely ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website.
                            This Privacy Policy explains how we handle data when you use our image resizing services.
                        </p>

                        <h3 className="text-xl font-bold text-[#D02752] mt-8 mb-4 uppercase">2. Information We Collect</h3>
                        <p>
                            <strong>Uploaded Images:</strong> Images uploaded to our service are processed temporarily for the purpose of resizing and editing.
                            We do not permanently store your images on our servers. They are processed in memory and are typically deleted immediately after the processed image is generated or within a short retention period for performance buffering.
                        </p>
                        <p>
                            <strong>Usage Data:</strong> We use tools like Google Analytics to collect anonymous information about how our website is accessed and used. This may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.
                        </p>

                        <h3 className="text-xl font-bold text-[#D02752] mt-8 mb-4 uppercase">3. Cookies and Tracking Technologies</h3>
                        <p>
                            We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.
                            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                        </p>

                        <h3 className="text-xl font-bold text-[#D02752] mt-8 mb-4 uppercase">4. Data Security</h3>
                        <p>
                            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.
                            While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                        </p>

                        <h3 className="text-xl font-bold text-[#D02752] mt-8 mb-4 uppercase">5. Third-Party Services</h3>
                        <p>
                            We may employ third-party companies and individuals due to the following reasons:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>To facilitate our Service;</li>
                            <li>To provide the Service on our behalf;</li>
                            <li>To perform Service-related services; or</li>
                            <li>To assist us in analyzing how our Service is used.</li>
                        </ul>

                        <h3 className="text-xl font-bold text-[#D02752] mt-8 mb-4 uppercase">6. Changes to This Privacy Policy</h3>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                        </p>

                        <h3 className="text-xl font-bold text-[#D02752] mt-8 mb-4 uppercase">7. Contact Us</h3>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us via email.
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
