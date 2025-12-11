import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, AlertCircle,Instagram} from 'lucide-react';

function Contact() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const public_id=import.meta.env.VITE_PUBLIC_ID;
  useEffect(() => {
    // Load EmailJS
    const emailJSScript = document.createElement('script');
    emailJSScript.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    emailJSScript.async = true;
    emailJSScript.onload = () => {
      if (window.emailjs) {
        // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
        window.emailjs.init(public_id);
      }
    };
    document.body.appendChild(emailJSScript);

    // Load GSAP
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.async = true;
    script.onload = () => {
      if (window.gsap) {
        const gsap = window.gsap;
        
        // Hero Animation
        gsap.fromTo('.contact-hero',
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );

        // Floating animation
        gsap.to('.float-element', {
          y: -20,
          duration: 2,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          stagger: 0.3
        });

        // Form Animation
        gsap.fromTo('.contact-form',
          { opacity: 0, x: -60 },
          { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.3 }
        );

        // Info Cards Animation
        gsap.fromTo('.info-card',
          { opacity: 0, y: 60, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.5)', delay: 0.5 }
        );

        // Social Links Animation
        gsap.fromTo('.social-link',
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)', delay: 0.8 }
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.body.contains(emailJSScript)) {
        document.body.removeChild(emailJSScript);
      }
    };
  }, []);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const service_id=import.meta.env.VITE_SERVICE_ID;
  const template_id=import.meta.env.VITE_TEMPLATE_ID;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Send email using EmailJS
      if (window.emailjs) {
        const templateParams = {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: 'mira.capturemoments@gmail.com'
        };

        // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs
        await window.emailjs.send(
          service_id,
          template_id,
          templateParams
        );

        setSubmitStatus('success');
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
          });
          setSubmitStatus(null);
        }, 5000);
      } else {
        throw new Error('EmailJS not loaded');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)'
    }}>
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-pink-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link 
              to="/"
              className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500"
              style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '0.5px' }}
            >
              Mira
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to="/"
                className="text-base text-gray-700 hover:text-pink-600 font-medium transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Home
              </Link>
              <Link 
                to="/about"
                className="text-base text-gray-700 hover:text-pink-600 font-medium transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                About
              </Link>
              <Link 
                to="/contact"
                className="text-base text-pink-600 font-medium"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Contact
              </Link>
              <a 
                href="https://www.instagram.com/mira.capturemoments?igsh=ZGEwbXVvdG54aHVw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-pink-600 transition-colors"
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
              <Link 
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-menu-item block w-full text-left text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Home
              </Link>
              <Link 
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-menu-item block w-full text-left text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                About
              </Link>
              <Link 
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-menu-item block w-full text-left text-pink-600 bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Contact
              </Link>
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

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl float-element"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl float-element"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-rose-300 rounded-full blur-3xl float-element"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="contact-hero space-y-6">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                💌 GET IN TOUCH
              </span>
            </div>
            
            <h1 
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-800 leading-tight"
              style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-2px' }}
            >
              Let's Create
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-purple-500">
                Something Amazing
              </span>
            </h1>
            
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Have questions, suggestions, or just want to say hello? We'd love to hear from you. 
              Drop us a message and we'll get back to you as soon as possible!
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="contact-form">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-pink-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                      placeholder="John Doe"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                      placeholder="john@example.com"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                      placeholder="What's this about?"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors resize-none"
                      placeholder="Tell us what's on your mind..."
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    ></textarea>
                  </div>

                  {submitStatus === 'success' && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                      <p className="text-green-700 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Message sent successfully! We'll get back to you soon.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
                      <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
                      <p className="text-red-700 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Failed to send message. Please try again or email us directly.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-6">
              <div className="info-card bg-gradient-to-br from-pink-50 to-rose-100 rounded-3xl p-8 shadow-xl border-2 border-pink-200">
                <div className="bg-gradient-to-br from-pink-400 to-rose-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Mail className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Email Us
                </h3>
                <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Send us an email anytime. We'll respond within 24 hours.
                </p>
                <a 
                  href="mailto:mira.capturemoments@gmail.com"
                  className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  mira.capturemoments@gmail.com
                </a>
              </div>

              <div className="info-card bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-8 shadow-xl border-2 border-purple-200">
                <div className="bg-gradient-to-br from-purple-400 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <MessageSquare className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Live Chat
                </h3>
                <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Our support team is available Monday to Friday, 9AM - 6PM IST.
                </p>
                <button className="text-purple-600 font-semibold hover:text-purple-700 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Start a conversation
                </button>
              </div>

              <div className="info-card bg-gradient-to-br from-rose-50 to-pink-100 rounded-3xl p-8 shadow-xl border-2 border-rose-200">
                <div className="bg-gradient-to-br from-rose-400 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Github className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Follow Us
                </h3>
                <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Stay updated with our latest features and updates.
                </p>
                <div className="flex gap-3">
                  <a 
                    href="https://github.com/Priyam-265" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-xl transition-colors"
                  >
                    <Github size={24} />
                  </a>
                  <a 
                    href="mailto:mira.capturemoments@gmail.com"
                    className="social-link bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-xl transition-colors"
                  >
                    <Mail size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                How long does it take to get a response?
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                We typically respond within 24 hours during business days. For urgent matters, please mark your email as high priority.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Can I suggest new features?
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Absolutely! We love hearing from our users. Send us your ideas and we'll consider them for future updates.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Do you offer custom solutions?
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Yes! If you need custom features or enterprise solutions, reach out to us and we'll discuss your requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-pink-200 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            © 2025 Mira. All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
        
        * {
          perspective: 1000px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Contact;