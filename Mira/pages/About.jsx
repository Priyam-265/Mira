import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Camera, Zap, Award, Mail, Star, TrendingUp, Instagram, Shield,CameraIcon,Palette,Download } from 'lucide-react';

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
                         className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500 cursor-pointer"
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
                           to="/creatortools"
                           className="text-base text-gray-700 hover:text-pink-600 font-medium transition-colors"
                           style={{ fontFamily: 'Inter, sans-serif' }}
                         >
                           Creator Tools
                         </Link>
                         <Link 
                           to="/about"
                           className="text-base text-gray-700 hover:text-pink-600 font-medium transition-colors"
                           style={{ fontFamily: 'Inter, sans-serif' }}
                         >
                           About
                         </Link>
                         <Link
                           to='/contact'
                           className="text-base text-gray-700 hover:text-pink-600 font-medium transition-colors"
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
                         <button 
                           onClick={() => {
                             setStep('home');
                             setMobileMenuOpen(false);
                           }}
                           className="mobile-menu-item block w-full text-left text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                           style={{ fontFamily: 'Inter, sans-serif' }}
                         >
                           Home
                         </button>
                         <Link 
                           to="/about"
                           onClick={() => setMobileMenuOpen(false)}
                           className="mobile-menu-item block w-full text-left text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                           style={{ fontFamily: 'Inter, sans-serif' }}
                         >
                           About
                         </Link>
                         <Link 
                           to="/creatortools"
                           onClick={() => setMobileMenuOpen(false)}
                           className="mobile-menu-item block w-full text-left text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                           style={{ fontFamily: 'Inter, sans-serif' }}
                         >
                           Creator Tools
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
      {/* NEW: Creator Tools Banner - Strategic placement after hero */}
            <div className="mt-12 sm:mt-16 px-4">
              <Link to="/creatortools">
                <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-3xl p-8 sm:p-12 shadow-2xl hover:shadow-purple-300/50 transition-all hover:scale-[1.02] cursor-pointer overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Floating elements */}
                  <div className="absolute top-4 right-4 text-3xl sm:text-4xl opacity-30 group-hover:scale-110 transition-transform">✨</div>
                  <div className="absolute bottom-4 left-4 text-3xl sm:text-4xl opacity-30 group-hover:scale-110 transition-transform">🎨</div>
                  <div className="absolute top-1/2 right-1/4 text-2xl sm:text-3xl opacity-20 hidden sm:block">🚀</div>
                  
                  <div className="relative z-10 text-center">
                    <div className="inline-block mb-3">
                      <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-xs sm:text-sm font-bold border border-white/30">
                        ✨ NEW FEATURE
                      </span>
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      AI-Powered Creator Tools
                    </h2>
                    
                    <p className="text-white/95 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Take your content to the next level! Generate captions, remove backgrounds, create hashtags, and more with our professional AI tools.
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6">
                      <div className="flex items-center gap-2 text-white/90 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Sparkles size={18} className="flex-shrink-0" />
                        <span>AI Caption Generator</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <TrendingUp size={18} className="flex-shrink-0" />
                        <span>Hashtag Generator</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <CameraIcon size={18} className="flex-shrink-0" />
                        <span>Background Remover</span>
                      </div>
                    </div>
                    
                    <button className="bg-white text-purple-600 px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all inline-flex items-center gap-2 sm:gap-3 group-hover:bg-yellow-50" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span>Explore Creator Tools</span>
                      <Zap size={20} className="group-hover:rotate-12 transition-transform" />
                    </button>
                  </div>
                </div>
              </Link>
            </div>

            {/* Features Section */}
            {/* <div className="features-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-20 px-4">
              <div className="feature-card group bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-pink-100 cursor-pointer">
                <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:rotate-6 transition-transform">
                  <CameraIcon className="text-pink-500" size={28} />
                </div>
                <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  6 Unique Layouts
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Classic strips, heart frames, grids & more. Perfect for every occasion! 📸
                </p>
              </div>

              <div className="feature-card group bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-purple-100 cursor-pointer">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:rotate-6 transition-transform">
                  <Sparkles className="text-purple-500" size={28} />
                </div>
                <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  14+ Pro Filters
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Vintage, warm, cool, B&W and more. Instagram-worthy in seconds! ✨
                </p>
              </div>

              <div className="feature-card group bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-rose-100 cursor-pointer">
                <div className="bg-gradient-to-br from-rose-100 to-pink-100 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:rotate-6 transition-transform">
                  <Palette className="text-rose-500" size={28} />
                </div>
                <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Custom Frames
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  9 colors & 9 patterns. Make it uniquely yours with hearts, stars & more! 🎨
                </p>
              </div>

              <div className="feature-card group bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-indigo-100 cursor-pointer">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:rotate-6 transition-transform">
                  <Download className="text-indigo-500" size={28} />
                </div>
                <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Instant Download
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  High-quality PNG export. Share on social media instantly! 💾
                </p>
              </div>
            </div> */}
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
                  From vintage to modern, black & white to vibrant colors - find the perfect mood for every moment. Our carefully curated collection includes warm tones for cozy memories, cool filters for modern aesthetics, dramatic black and white options, and vibrant color enhancements that make your photos pop. Each filter is professionally designed to enhance your photos while maintaining natural skin tones and image quality.
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
                  Choose from 9 beautiful colors and 9 unique patterns to personalize your photo strip with your unique style. Whether you prefer gradient backgrounds, solid colors, or playful patterns like hearts, stars, dots, and stripes, we have options to match every mood and occasion. Create photo strips that reflect your personality and make your memories truly one-of-a-kind.
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
                  Classic strips, grids, heart shapes, holiday themes, film strips, and collages - perfect for any occasion. Each layout is thoughtfully designed to showcase your photos in the best way possible. The classic strip is ideal for traditional photo booth memories, while our grid layout offers a modern aesthetic. Heart-shaped layouts add romance, holiday themes bring festive cheer, film strips provide a retro vibe, and collages let you tell a complete story with multiple photos.
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
                  See your changes instantly with our real-time preview system. Adjust brightness, contrast, saturation, and more with live updates that show exactly how your final photo will look. No more guessing or waiting - what you see is what you get. Our intuitive editing tools make professional-quality photo editing accessible to everyone, regardless of experience level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-800"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Our Story
          </h2>
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-pink-200">
            <p className="text-gray-700 text-lg leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Mira was born from a simple idea: everyone deserves to create beautiful, professional-quality photo booth memories without expensive equipment or complicated software. We noticed that while traditional photo booths were fun, they were often inaccessible, expensive, and limited in customization options.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Our mission is to democratize photo booth experiences by bringing them directly to your web browser. Whether you're celebrating a birthday, hosting a wedding, organizing a corporate event, or just having fun with friends, Mira provides all the tools you need to create memorable photo strips that you'll treasure forever.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              We believe that technology should be accessible, intuitive, and delightful to use. That's why we've crafted Mira with attention to every detail - from the smooth animations to the carefully selected color palettes, from the professional-grade filters to the instant preview system. Our goal is to make photo creation not just easy, but genuinely enjoyable.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Today, thousands of users worldwide trust Mira to capture their special moments. From intimate gatherings to large celebrations, from personal memories to shared experiences, we're honored to be part of your story. Every photo strip created on Mira represents a moment of joy, laughter, or love - and that's what drives us to continuously improve and innovate.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Perfect For Every Occasion
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Parties & Celebrations
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Make your birthday parties, anniversaries, and celebrations unforgettable with custom photo strips that guests can take home as keepsakes.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="text-4xl mb-4">💒</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Weddings & Engagements
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Create beautiful wedding photo booth memories with romantic filters and heart-shaped layouts that match your special day perfectly.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Corporate Events
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Add fun to team building events, conferences, and company parties with professional photo strips that boost employee engagement.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                School & University
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Perfect for prom nights, graduation parties, and school events. Create lasting memories with friends before everyone goes their separate ways.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="text-4xl mb-4">🎄</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Holiday Gatherings
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Capture the magic of holiday seasons with our special themed layouts perfect for Christmas, New Year, and other festive occasions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Family Moments
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Document precious family moments, reunions, and everyday joy with easy-to-use tools that everyone from kids to grandparents can enjoy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="cta-button bg-gradient-to-br from-pink-500 via-rose-500 to-purple-500 rounded-3xl p-12 shadow-2xl">
            <h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Ready to Create Magic?
            </h2>
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
              Join thousands of users creating beautiful photo booth memories every day
            </p>
            <Link 
              to="/"
              className="inline-block bg-white text-pink-600 px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Start Creating Now
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            How Mira Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-pink-400 to-rose-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white text-3xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Upload Photos
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Select up to 4 photos from your device or take new ones with your camera
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white text-3xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Choose Layout
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Pick from 6 unique layouts including strips, grids, and themed designs
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-rose-400 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white text-3xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Apply Filters
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Transform your photos with 14+ professional filters and customize colors
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white text-3xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Download & Share
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Save your creation instantly and share it on social media or print it
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Built with Modern Technology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-pink-100">
              <div className="flex items-center gap-4 mb-4">
                <Shield className="text-pink-500" size={32} />
                <h3 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Privacy First
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Your photos are processed entirely in your browser - we never upload or store your images on our servers. What happens on your device stays on your device. Your privacy and security are our top priorities, ensuring complete control over your personal memories.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border border-pink-100">
              <div className="flex items-center gap-4 mb-4">
                <Zap className="text-purple-500" size={32} />
                <h3 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Lightning Performance
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Built with cutting-edge web technologies including React, HTML5 Canvas, and modern JavaScript. Our optimized rendering engine ensures smooth performance even on mobile devices, delivering instant results without compromising quality.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border border-pink-100">
              <div className="flex items-center gap-4 mb-4">
                <Camera className="text-rose-500" size={32} />
                <h3 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  High Resolution Output
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Download your creations in high resolution perfect for printing or sharing on social media. Our advanced image processing maintains quality while applying filters and effects, ensuring your photos look stunning in any format.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border border-pink-100">
              <div className="flex items-center gap-4 mb-4">
                <Sparkles className="text-pink-500" size={32} />
                <h3 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Cross-Platform Compatible
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Works seamlessly on desktop, tablet, and mobile devices. Whether you're using Chrome, Safari, Firefox, or Edge, Mira delivers a consistent, beautiful experience across all platforms and screen sizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="team-card bg-white rounded-2xl p-8 shadow-xl border border-pink-100">
              <div className="flex items-center gap-2 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                "Mira made our wedding so special! Guests loved creating photo strips with different filters. It was the highlight of our reception and we have hundreds of amazing memories to look back on."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <div>
                  <p className="font-bold text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>Sarah Johnson</p>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Wedding, June 2024</p>
                </div>
              </div>
            </div>

            <div className="team-card bg-white rounded-2xl p-8 shadow-xl border border-pink-100">
              <div className="flex items-center gap-2 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                "As an event planner, I use Mira for all my corporate events. It's professional, easy to use, and clients always ask about it. The variety of layouts and filters is impressive!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
                <div>
                  <p className="font-bold text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>Michael Chen</p>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Event Planner</p>
                </div>
              </div>
            </div>

            <div className="team-card bg-white rounded-2xl p-8 shadow-xl border border-pink-100">
              <div className="flex items-center gap-2 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                "My daughter's birthday party was a hit thanks to Mira! The kids had so much fun taking photos with different filters. Super easy to use and the results were amazing!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  E
                </div>
                <div>
                  <p className="font-bold text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>Emily Rodriguez</p>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Parent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100">
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Is Mira really free to use?
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Yes! Mira is completely free to use. All features including filters, layouts, frames, and high-resolution downloads are available at no cost. We believe everyone should have access to professional photo booth tools.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100">
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Do you store my photos?
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                No, we don't store any of your photos. All processing happens directly in your web browser. Your photos never leave your device unless you choose to download or share them. Your privacy is completely protected.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100">
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                What devices are supported?
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Mira works on all modern devices including desktop computers, laptops, tablets, and smartphones. We support Chrome, Safari, Firefox, and Edge browsers. For the best experience, we recommend using a device with a screen size of at least 768px width.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100">
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Can I print the photo strips?
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Absolutely! Our photo strips are generated in high resolution, perfect for printing. You can download them as PNG files and print them at home or at any photo printing service. The standard 2x6 inch size works great for traditional photo strip prints.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100">
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                How many photos can I add to a layout?
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Different layouts support different numbers of photos. The classic strip and film strip support up to 4 photos, while other layouts like the grid and collage can accommodate various arrangements. Simply choose your layout and upload the appropriate number of photos.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100">
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Can I use Mira for commercial events?
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Yes! Mira is perfect for both personal and commercial use. Event planners, photographers, and businesses regularly use Mira for weddings, corporate events, parties, and more. There are no restrictions on commercial usage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-800"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Start Creating Beautiful Memories Today
          </h2>
          <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            No signup required. No credit card needed. Just open Mira and start creating stunning photo strips in seconds. Join thousands of happy users who trust Mira to capture their special moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/"
              className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Create Photo Strip Now
            </Link>
            <Link 
              to="/contact"
              className="inline-block bg-white text-pink-600 border-2 border-pink-500 px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

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
    </div>
  );
}

export default About;