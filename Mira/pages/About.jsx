import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Sparkles, Camera, Zap, Users, Award, Mail, Star, TrendingUp } from 'lucide-react';

function About() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Load GSAP
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.async = true;
    script.onload = () => {
      if (window.gsap) {
        const gsap = window.gsap;
        
        // Hero Section Animation
        gsap.fromTo('.about-hero',
          { opacity: 0, scale: 0.8, y: 50 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power4.out' }
        );

        // Floating animation for hero elements
        gsap.to('.float-element', {
          y: -20,
          duration: 2,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          stagger: 0.3
        });

        // Cards Animation
        gsap.fromTo('.about-card',
          { opacity: 0, y: 80, rotateX: -20, scale: 0.9 },
          { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 1, stagger: 0.2, ease: 'back.out(1.5)', delay: 0.5 }
        );

        // Features Animation
        gsap.fromTo('.about-feature',
          { opacity: 0, x: -60 },
          { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.8 }
        );

        // Stats Counter Animation
        gsap.fromTo('.stat-number',
          { innerText: 0, opacity: 0 },
          { 
            innerText: (i, target) => target.getAttribute('data-count'),
            opacity: 1,
            duration: 2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            stagger: 0.2,
            delay: 1
          }
        );

        // Team Card 3D Effect
        gsap.fromTo('.team-card',
          { opacity: 0, rotateY: -90, z: -100 },
          { opacity: 1, rotateY: 0, z: 0, duration: 1, ease: 'back.out(1.5)', delay: 1.2 }
        );

        // CTA Button Animation
        gsap.fromTo('.cta-button',
          { opacity: 0, scale: 0.5, rotate: -10 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)', delay: 1.5 }
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
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
                className="text-base text-pink-600 font-medium"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                About
              </Link>
              <Link 
              to="/contact" 
                className="text-base text-gray-700 hover:text-pink-600 font-medium transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Contact
              </Link>
              <a 
                href="https://github.com/Priyam-265" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-pink-600 transition-colors"
              >
                <Github size={20} />
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
                className="mobile-menu-item block w-full text-left text-pink-600 bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                About
              </Link>
              <Link 
              to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-menu-item block w-full text-left text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Contact
              </Link>
              <a 
                href="https://github.com/Priyam-265" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mobile-menu-item flex items-center gap-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Github size={20} />
                <span>GitHub</span>
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
          <div className="about-hero space-y-6">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                ✨ ABOUT MIRA
              </span>
            </div>
            
            <h1 
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-800 leading-tight"
              style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-2px' }}
            >
              Capturing
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-purple-500">
                Life's Magic
              </span>
            </h1>
            
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              We believe every moment deserves to be celebrated. Mira transforms ordinary photos 
              into extraordinary memories with professional-grade filters, stunning layouts, and 
              endless creative possibilities.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-pink-100 hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 stat-number" data-count="50000">
                0
              </div>
              <p className="text-gray-600 mt-2 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                Photos Created
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-pink-100 hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 stat-number" data-count="15000">
                0
              </div>
              <p className="text-gray-600 mt-2 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                Happy Users
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-pink-100 hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500 stat-number" data-count="14">
                0
              </div>
              <p className="text-gray-600 mt-2 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                Pro Filters
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-pink-100 hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 stat-number" data-count="6">
                0
              </div>
              <p className="text-gray-600 mt-2 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                Unique Layouts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="about-cards-container py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Why Choose Mira?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="about-card bg-gradient-to-br from-pink-50 to-rose-100 rounded-3xl p-8 shadow-2xl border-2 border-pink-200 hover:shadow-pink-300/50 transition-all">
              <div className="bg-gradient-to-br from-pink-400 to-rose-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Camera className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Professional Quality
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Studio-grade filters and effects that make every photo look professionally edited. 
                No experience needed.
              </p>
            </div>

            <div className="about-card bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-8 shadow-2xl border-2 border-purple-200 hover:shadow-purple-300/50 transition-all">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Sparkles className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Endless Creativity
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Mix and match filters, frames, stickers, and layouts to create something truly unique 
                every time.
              </p>
            </div>

            <div className="about-card bg-gradient-to-br from-rose-50 to-pink-100 rounded-3xl p-8 shadow-2xl border-2 border-rose-200 hover:shadow-rose-300/50 transition-all">
              <div className="bg-gradient-to-br from-rose-400 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Lightning Fast
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Create beautiful photo strips in seconds. Real-time previews and instant downloads 
                make it effortless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="features-section py-20 px-4 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Packed with Features
          </h2>
          
          <div className="space-y-6">
            <div className="about-feature flex items-start gap-6 bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star className="text-pink-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  14+ Professional Filters
                </h3>
                <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  From vintage to modern, black & white to vibrant colors - find the perfect mood for every moment.
                </p>
              </div>
            </div>

            <div className="about-feature flex items-start gap-6 bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="text-purple-500 fill-purple-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Custom Frames & Patterns
                </h3>
                <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Choose from 9 colors and 9 patterns to personalize your photo strip with your unique style.
                </p>
              </div>
            </div>

            <div className="about-feature flex items-start gap-6 bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="bg-gradient-to-br from-rose-100 to-pink-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="text-rose-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  6 Unique Layouts
                </h3>
                <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Classic strips, grids, heart shapes, holiday themes, film strips, and collages - perfect for any occasion.
                </p>
              </div>
            </div>

            <div className="about-feature flex items-start gap-6 bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-pink-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Real-time Editing
                </h3>
                <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  See your changes instantly. Adjust brightness, contrast, saturation, and more with live previews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="team-section py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-800"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Meet the Creator
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Built with passion by a developer who loves creating delightful experiences
          </p>
          
          <div className="flex justify-center">
            <div className="team-card bg-white rounded-3xl p-8 shadow-2xl border-2 border-pink-200 max-w-md hover:scale-105 transition-transform">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
                <Users className="text-white" size={64} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Priyam
              </h3>
              <p className="text-pink-500 text-center font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Full Stack Developer
              </p>
              <p className="text-gray-600 text-center mb-6 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Passionate about creating beautiful, user-friendly applications that bring joy to people's lives.
              </p>
              <div className="flex justify-center gap-4">
                <a 
                  href="https://github.com/Priyam-265" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-xl transition-colors"
                >
                  <Github size={24} />
                </a>
                <a 
                  href="mailto:mira.capturemoments@gmail.com"
                  className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-xl transition-colors"
                >
                  <Mail size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-purple-500 rounded-3xl p-12 shadow-2xl">
            <h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Ready to Create Magic?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
              Join thousands of users creating beautiful memories every day. Start your photo booth experience now!
            </p>
            <Link 
              to="/"
              className="cta-button bg-white text-pink-600 px-12 py-4 rounded-xl text-xl font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all inline-flex items-center gap-3"
            >
              <span>Get Started Free</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
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
      `}</style>
    </div>
  );
}

export default About;