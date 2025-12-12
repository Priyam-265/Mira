import React, { useState, useEffect } from 'react';
import { X, Shield, FileText, Instagram, Home, Mail,Heart } from 'lucide-react';
import { Link } from 'react-router-dom'; 
function LegalPages() {
  const [activePage, setActivePage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hamburger Animation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gsap) {
      const gsap = window.gsap;
      
      if (mobileMenuOpen) {
        gsap.to('.hamburger-line-1', { rotate: 45, y: 8, duration: 0.4, ease: 'power3.inOut' });
        gsap.to('.hamburger-line-2', { scaleX: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut' });
        gsap.to('.hamburger-line-3', { rotate: -45, y: -8, duration: 0.4, ease: 'power3.inOut' });
      } else {
        gsap.to('.hamburger-line-1', { rotate: 0, y: 0, duration: 0.4, ease: 'power3.inOut' });
        gsap.to('.hamburger-line-2', { scaleX: 1, opacity: 1, duration: 0.3, ease: 'power2.inOut' });
        gsap.to('.hamburger-line-3', { rotate: 0, y: 0, duration: 0.4, ease: 'power3.inOut' });
      }
    }
  }, [mobileMenuOpen]);

  // Mobile Menu Animation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gsap) {
      const gsap = window.gsap;
      
      if (mobileMenuOpen) {
        gsap.fromTo('.mobile-menu-container',
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.5, ease: 'power3.out' }
        );
        
        gsap.fromTo('.mobile-menu-item',
          { opacity: 0, x: -50, rotateY: -90 },
          { opacity: 1, x: 0, rotateY: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)', delay: 0.2 }
        );
      }
    }
  }, [mobileMenuOpen]);

  // Load GSAP
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const PrivacyPolicy = () => (
    <div className="space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-pink-500" style={{ fontFamily: 'Outfit, sans-serif' }}>
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-600 italic">Last Updated: December 12, 2025</p>
      
      <p>Welcome to Mira. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we handle your information when you use our service.</p>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          1. Information We Collect
        </h2>
        <p className="mb-3"><strong>1.1 Photos and Images</strong></p>
        <p className="mb-3">When you use our photo booth service, you may capture or upload photos. All photos are processed locally in your browser and are not automatically uploaded to our servers. Your photos remain on your device unless you explicitly choose to download or share them.</p>
        
        <p className="mb-3"><strong>1.2 Camera Access</strong></p>
        <p className="mb-3">Our app requests access to your device camera to capture photos. Camera access is only used when you actively choose to take photos and is not accessed at any other time.</p>
        
        <p className="mb-3"><strong>1.3 Usage Data</strong></p>
        <p>We may collect anonymous usage data including:</p>
        <ul className="list-disc ml-6 mb-3">
          <li>Browser type and version</li>
          <li>Device type and screen resolution</li>
          <li>Pages visited and features used</li>
          <li>Time and date of visits</li>
          <li>Referring website addresses</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          2. How We Use Your Information
        </h2>
        <p>We use the collected information to:</p>
        <ul className="list-disc ml-6 mb-3">
          <li>Provide and maintain our photo booth service</li>
          <li>Improve user experience and app functionality</li>
          <li>Analyze usage patterns to enhance our service</li>
          <li>Detect and prevent technical issues</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          3. Third-Party Services
        </h2>
        <p className="mb-3"><strong>3.1 Google AdSense</strong></p>
        <p className="mb-3">We use Google AdSense to display advertisements on our service. Google may use cookies and similar technologies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">Google Ads Settings</a>.</p>
        
        <p className="mb-3"><strong>3.2 Cookies and Tracking</strong></p>
        <p className="mb-3">We and our advertising partners may use cookies, web beacons, and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings.</p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          4. Data Storage and Security
        </h2>
        <p className="mb-3">Your photos are processed and stored locally on your device. We do not store your photos on our servers. We implement reasonable security measures to protect any data we do collect, but no method of transmission over the internet is 100% secure.</p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          5. Your Rights and Choices
        </h2>
        <p>You have the right to:</p>
        <ul className="list-disc ml-6 mb-3">
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to processing of your data</li>
          <li>Opt out of personalized advertising</li>
          <li>Withdraw consent at any time</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          6. Children's Privacy
        </h2>
        <p className="mb-3">Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.</p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          7. Changes to This Privacy Policy
        </h2>
        <p className="mb-3">We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date.</p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          8. Contact Us
        </h2>
        <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500">
          <p className="mb-2">If you have any questions about this Privacy Policy, please contact us:</p>
          <p className="mb-1"><strong>Email:</strong> mira.capturemoments@gmail.com</p>
          <p><strong>Website:</strong> miraphotobooth.live</p>
        </div>
      </section>
    </div>
  );

  const TermsAndConditions = () => (
    <div className="space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-pink-500" style={{ fontFamily: 'Outfit, sans-serif' }}>
        Terms and Conditions
      </h1>
      <p className="text-sm text-gray-600 italic">Last Updated: December 12, 2025</p>
      
      <p>Please read these Terms and Conditions carefully before using Mira. By accessing or using our service, you agree to be bound by these terms.</p>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          1. Acceptance of Terms
        </h2>
        <p className="mb-3">By accessing and using Mira, you accept and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our service.</p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          2. Description of Service
        </h2>
        <p className="mb-3">Mira is a web-based application that allows users to capture photos using their device camera or upload images, apply layouts and customizations, and download the final photo strips. The service is provided free of charge and is supported by advertising.</p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          3. User Responsibilities
        </h2>
        <p className="mb-3"><strong>3.1 Appropriate Use</strong></p>
        <p className="mb-3">You agree to use our service only for lawful purposes and in accordance with these terms. You must not:</p>
        <ul className="list-disc ml-6 mb-3">
          <li>Use the service in any way that violates applicable laws or regulations</li>
          <li>Upload or create content that is offensive, defamatory, or infringes on others' rights</li>
          <li>Use the service to harass, abuse, or harm others</li>
          <li>Attempt to interfere with the proper functioning of the service</li>
          <li>Use automated systems to access the service without permission</li>
        </ul>

        <p className="mb-3"><strong>3.2 Content Ownership</strong></p>
        <p className="mb-3">You retain all rights to the photos you capture or upload through our service. By using our service, you grant us a limited license to process your images solely for the purpose of providing the photo booth functionality.</p>

        <p className="mb-3"><strong>3.3 Camera and Device Permissions</strong></p>
        <p className="mb-3">You are responsible for granting appropriate permissions for camera access. We are not responsible for any issues arising from denied permissions or device compatibility problems.</p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          4. Intellectual Property Rights
        </h2>
        <p className="mb-3">The Mira service, including its design, layout, graphics, and code, is owned by us and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express written permission.</p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          5. Advertising
        </h2>
        <p className="mb-3">Our service is supported by third-party advertising, including Google AdSense. We reserve the right to display advertisements throughout the service. Advertisers are solely responsible for the content of their advertisements.</p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          6. Disclaimers and Limitations of Liability
        </h2>
        <p className="mb-3"><strong>6.1 Service Availability</strong></p>
        <p className="mb-3">We provide the service on an "as is" and "as available" basis. We do not guarantee that the service will be uninterrupted, secure, or error-free. We reserve the right to modify, suspend, or discontinue the service at any time without notice.</p>

        <p className="mb-3"><strong>6.2 No Warranties</strong></p>
        <p className="mb-3">We make no warranties or representations about the accuracy, reliability, or completeness of the service. Your use of the service is at your own risk.</p>

        <p className="mb-3"><strong>6.3 Limitation of Liability</strong></p>
        <p className="mb-3">To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, revenue, or profits, arising from your use of the service.</p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          7. Data and Privacy
        </h2>
        <p className="mb-3">Your use of the service is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your information.</p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          8. User-Generated Content
        </h2>
        <p className="mb-3">You are solely responsible for the content you create using our service. We do not monitor or control user-generated content and are not responsible for any offensive, inappropriate, or illegal content created by users.</p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          9. Termination
        </h2>
        <p className="mb-3">We reserve the right to terminate or suspend your access to the service at any time, without notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties.</p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          10. Changes to Terms
        </h2>
        <p className="mb-3">We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued use of the service after changes are posted constitutes acceptance of the modified terms.</p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          11. Governing Law
        </h2>
        <p className="mb-3">These Terms and Conditions shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.</p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          12. Contact Information
        </h2>
        <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500">
          <p className="mb-2">If you have any questions about these Terms and Conditions, please contact us:</p>
          <p className="mb-1"><strong>Email:</strong> mira.capturemoments@gmail.com</p>
          <p><strong>Website:</strong> miraphotobooth.live</p>
        </div>
      </section>

      <section className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> By using Mira, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
        </p>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-pink-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <a 
              href="/"
              className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500"
              style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '0.5px' }}
            >
              Mira
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a 
                href="/"
                className="text-base text-gray-700 hover:text-pink-600 font-medium transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Home
              </a>
              <a 
                href="/about"
                className="text-base text-gray-700 hover:text-pink-600 font-medium transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                About
              </a>
              <a 
              href="/contact" 
                className="text-base text-gray-700 hover:text-pink-600 font-medium transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Contact
              </a>
              <a 
                href="https://www.instagram.com/mira.capturemoments?igsh=ZGEwbXVvdG54aHVw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-pink-600 font-medium transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Instagram size={20} />
                
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button 
              className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="hamburger-line-1 w-6 h-0.5 bg-gray-700 rounded-full block origin-center"></span>
              <span className="hamburger-line-2 w-6 h-0.5 bg-gray-700 rounded-full block origin-center"></span>
              <span className="hamburger-line-3 w-6 h-0.5 bg-gray-700 rounded-full block origin-center"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu-container md:hidden bg-white/95 backdrop-blur-md border-t border-pink-200 shadow-lg overflow-hidden">
            <div className="px-4 py-3 space-y-1">
              <a 
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-menu-item block w-full text-left text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Home
              </a>
              <a 
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-menu-item block w-full text-left text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                About
              </a>
              <a 
              href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-menu-item block w-full text-left text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Contact
              </a>
              <a 
                href="https://www.instagram.com/mira.capturemoments?igsh=ZGEwbXVvdG54aHVw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mobile-menu-item flex items-center gap-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Instagram size={20} />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="p-4 sm:p-8">
        {!activePage ? (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Legal Information
            </h1>
            <p className="text-center text-gray-600 mb-12" style={{ fontFamily: 'Inter, sans-serif' }}>
              Please review our privacy practices and terms of service
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setActivePage('privacy')}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-pink-200"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-4 rounded-full">
                    <Shield size={32} className="text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Privacy Policy
                </h2>
                <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Learn how we collect, use, and protect your information
                </p>
              </button>

              <button
                onClick={() => setActivePage('terms')}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-pink-200"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-4 rounded-full">
                    <FileText size={32} className="text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Terms & Conditions
                </h2>
                <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Understand the rules and guidelines for using our service
                </p>
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6 sm:p-10">
            <button
              onClick={() => setActivePage(null)}
              className="mb-6 text-pink-500 hover:text-pink-700 flex items-center gap-2 font-semibold transition-all hover:scale-105"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <X size={20} /> Back to Legal Pages
            </button>

            {activePage === 'privacy' ? <PrivacyPolicy /> : <TermsAndConditions />}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-pink-100 to-rose-100 py-12 px-4 border-t border-pink-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Mira
              </h3>
              <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Creating beautiful photo booth memories, one moment at a time.
              </p>
              <a 
                href="https://www.instagram.com/mira.capturemoments?igsh=ZGEwbXVvdG54aHVw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Instagram size={20} />
                Follow us on Instagram
              </a>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Quick Links
              </h4>
              <div className="space-y-2">
                <Link to="/" className="block text-gray-600 hover:text-pink-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Home
                </Link>
                <Link to="/about" className="block text-gray-600 hover:text-pink-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  About
                </Link>
                <Link to="/contact" className="block text-gray-600 hover:text-pink-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Contact
                </Link>
                <Link to="/terms" className="block text-gray-600 hover:text-pink-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Terms and conditions and privacy policy 
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Contact Us
              </h4>
              <div className="space-y-2 text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <a href="mailto:hello@mira.com" className="hover:text-pink-600">
                    mira.capturemoments@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-pink-200 pt-8 text-center">
            <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              © 2025 Mira. All rights reserved. Made with <Heart className="inline text-pink-500 fill-pink-500" size={16} /> for creating memories.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
}

export default LegalPages;