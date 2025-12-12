import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Camera from '../components/Camera';
import PhotoCanvas from '../components/PhotoCanvas';
import FiltersPanel from '../components/FiltersPanel';
import StickerPanel from '../components/StickerPanel';
import FrameCustomizer from '../components/FrameCustomizer';
import PhotoEditor from '../components/PhotoEditor';
import { Heart, Edit2, Sparkles, Camera as CameraIcon, Instagram, Zap, Download, Star, Palette, Shield, Mail, Users, Smile, Gift, TrendingUp } from 'lucide-react';

const LAYOUTS = [
  { id: 'layout-a', name: 'Classic', slots: 3, template: 'classic', description: '3 Photo Strip' },
  { id: 'layout-b', name: 'Grid', slots: 4, template: 'aesthetic', description: '4 Photo Grid' },
  { id: 'with-love', name: 'Hearts', slots: 3, template: 'hearts', description: 'Lovely Hearts', special: '💕 SPECIAL' },
  { id: 'holidays', name: 'Holiday', slots: 4, template: 'holiday', description: 'Festive Fun', special: '❄️ SEASONAL' },
  { id: 'filmstrip', name: 'Film Strip', slots: 2, template: 'filmstrip', description: 'Retro Style', special: '🎬 NEW' },
  { id: 'collage', name: 'Collage', slots: 6, template: 'collage', description: '6 Photo Mix', special: '🎨 NEW' }
];

function Booth() {
  const [step, setStep] = useState('home');
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('none');
  const [frameColor, setFrameColor] = useState({ 
    id: 'gradient-pink', 
    name: 'Pink Gradient', 
    bg: 'linear-gradient(135deg, #fce7f3, #f9a8d4)', 
    border: '#f472b6' 
  });
  const [framePattern, setFramePattern] = useState({ id: 'none', name: 'No Pattern', emoji: '⬜', color: 'rgba(0, 0, 0, 0.4)' });
  const [stickers, setStickers] = useState([]);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const finalCanvasRef = useRef(null);
  const heroRef = useRef(null);

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

  // Hero Animations
  useEffect(() => {
    if (step === 'home') {
      const animateHome = () => {
        if (typeof window !== 'undefined' && window.gsap) {
          const gsap = window.gsap;
          
          gsap.fromTo('.hero-title',
            { opacity: 0, y: 50, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power4.out', delay: 0.2 }
          );

          gsap.fromTo('.hero-subtitle',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 }
          );

          gsap.fromTo('.hero-cta',
            { opacity: 0, scale: 0.8, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 0.8 }
          );

          gsap.to('.float-1', {
            y: -20,
            rotation: 5,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });

          gsap.to('.float-2', {
            y: -15,
            rotation: -5,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 0.5
          });

          gsap.to('.float-3', {
            y: -25,
            rotation: 8,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1
          });

          gsap.to('.float-heart', {
            y: -30,
            rotation: 15,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: 0.3
          });

          gsap.to('.float-star', {
            y: -20,
            rotation: -10,
            scale: 1.1,
            duration: 2.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: 0.4
          });

          const counters = document.querySelectorAll('.counter-number');
          counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-target') || '0');
            if (target > 0) {
              gsap.fromTo(counter, 
                { textContent: 0 },
                {
                  textContent: target,
                  duration: 2,
                  delay: 1,
                  ease: 'power2.out',
                  snap: { textContent: 1 },
                  onUpdate: function() {
                    counter.textContent = Math.ceil(counter.textContent);
                  }
                }
              );
            }
          });

          gsap.fromTo('.feature-card',
            { opacity: 0, y: 50, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.2)', delay: 1.2 }
          );

          gsap.to('.shimmer', {
            x: '200%',
            duration: 2,
            repeat: -1,
            ease: 'power1.inOut',
            delay: 2
          });
        }
      };

      setTimeout(animateHome, 100);
      setTimeout(animateHome, 500);
    }
  }, [step]);

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

  // Page Transition Animations
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gsap) {
      const gsap = window.gsap;
      const elements = document.querySelectorAll('.animate-on-mount');
      
      gsap.fromTo(elements,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
    }
  }, [step]);

  const resetCustomizations = () => {
    setCurrentFilter('none');
    setFrameColor({ 
      id: 'gradient-pink', 
      name: 'Pink Gradient', 
      bg: 'linear-gradient(135deg, #fce7f3, #f9a8d4)', 
      border: '#f472b6' 
    });
    setFramePattern({ id: 'none', name: 'No Pattern', emoji: '⬜', color: 'rgba(0, 0, 0, 0.4)' });
    setStickers([]);
  };

  const handleLayoutSelect = (layout) => {
    setSelectedLayout(layout);
    setPhotos([]);
    resetCustomizations();
    setStep('camera');
  };

  const handlePhotosCaptured = (capturedPhotos) => {
    setPhotos(capturedPhotos);
    resetCustomizations();
    setStep('customize');
  };

  const handleReset = () => {
    setPhotos([]);
    resetCustomizations();
    setSelectedLayout(null);
    setStep('home');
  };

  const handleBackToCamera = () => {
    resetCustomizations();
    setPhotos([]);
    setStep('camera');
  };

  const addSticker = (emoji) => {
    setStickers([...stickers, {
      emoji,
      id: Date.now(),
      x: Math.random() * 200 + 200,
      y: Math.random() * 400 + 200,
      rotation: Math.random() * 30 - 15
    }]);
  };

  const handleSaveEditedPhoto = (index, editedPhoto) => {
    const newPhotos = [...photos];
    newPhotos[index] = editedPhoto;
    setPhotos(newPhotos);
    setEditingPhotoIndex(null);
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)'
    }}>
      {/* Professional Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-pink-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setStep('home')}
              className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500 cursor-pointer"
              style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '0.5px' }}
            >
              Mira
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => setStep('home')}
                className="text-base text-gray-700 hover:text-pink-600 font-medium transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Home
              </button>
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

      <div className="max-w-7xl mx-auto p-4 pb-12">
        {/* Enhanced Home Page */}
        {step === 'home' && (
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div ref={heroRef} className="relative text-center space-y-8 py-8 sm:py-16 px-4 overflow-hidden">
              {/* Floating decorative elements */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-pink-200 rounded-full blur-3xl opacity-60 float-1"></div>
              <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-60 float-2"></div>
              <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-rose-200 rounded-full blur-3xl opacity-60 float-3"></div>

              {/* Floating Hearts */}
              <div className="absolute top-20 left-5 text-4xl sm:text-6xl float-heart opacity-30">💕</div>
              <div className="absolute top-40 right-10 text-3xl sm:text-5xl float-heart opacity-25">❤️</div>
              <div className="absolute bottom-32 left-12 text-3xl sm:text-5xl float-heart opacity-20">💖</div>
              <div className="absolute bottom-48 right-16 text-4xl sm:text-6xl float-heart opacity-30">💗</div>
              <div className="absolute top-72 left-1/4 text-3xl sm:text-5xl float-heart opacity-25 hidden sm:block">💝</div>
              
              {/* Floating Stars */}
              <div className="absolute top-16 right-1/4 text-3xl sm:text-5xl float-star opacity-40">⭐</div>
              <div className="absolute bottom-40 right-8 text-2xl sm:text-4xl float-star opacity-35">✨</div>
              <div className="absolute top-80 right-20 text-3xl sm:text-5xl float-star opacity-30 hidden sm:block">🌟</div>
              <div className="absolute bottom-64 left-20 text-2xl sm:text-4xl float-star opacity-35">💫</div>
              <div className="absolute top-56 left-1/3 text-3xl sm:text-5xl float-star opacity-30 hidden md:block">⭐</div>

              {/* Camera Icons */}
              <div className="absolute top-32 left-1/4 text-3xl sm:text-4xl float-star opacity-20 hidden lg:block">📸</div>
              <div className="absolute bottom-56 right-1/4 text-3xl sm:text-4xl float-heart opacity-20 hidden lg:block">📷</div>

              {/* Main Hero Content */}
              <div className="relative z-10">
                <div className="inline-block mb-4">
                  <div className="bg-gradient-to-r from-pink-100 to-rose-100 px-4 py-2 rounded-full border-2 border-pink-200 shadow-lg">
                    <span className="text-pink-600 font-bold text-sm flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Sparkles size={16} className="animate-pulse" />
                      Online Photo Booth
                      <Sparkles size={16} className="animate-pulse" />
                    </span>
                  </div>
                </div>

                <h1 
                  className="hero-title text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 leading-tight mb-6"
                  style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-2px' }}
                >
                  Capture Your
                  <br />
                  <span className="relative inline-block">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-purple-500">
                      Best Moments
                    </span>
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
                    </div>
                  </span>
                </h1>

                <p className="hero-subtitle text-gray-600 text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Professional photo booth experience right in your browser. 
                  <span className="hidden sm:inline"><br /></span>
                  Create stunning photo strips with <span className="font-bold text-pink-600">14+ filters</span>, 
                  <span className="font-bold text-purple-600"> 6 layouts</span>, and 
                  <span className="font-bold text-rose-600"> unlimited creativity</span>. 
                  No download required! ✨
                </p>

                {/* CTA Button with hover effects */}
                <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                  <button
                    onClick={() => setStep('layout')}
                    className="group relative bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold shadow-2xl hover:shadow-pink-300/50 transition-all hover:scale-110 inline-flex items-center gap-3 overflow-hidden"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-rose-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Start Creating Now</span>
                    <Zap size={24} className="relative z-10 group-hover:rotate-12 transition-transform" />
                  </button>

                  <button
                    onClick={() => {
                      document.querySelector('.features-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-pink-600 hover:text-pink-700 font-semibold px-6 py-4 rounded-xl hover:bg-pink-50 transition-all text-base sm:text-lg"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    See How It Works →
                  </button>
                </div>

                {/* Social Proof Stats */}
                <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-600 counter-number" data-target="50000" style={{ fontFamily: 'Outfit, sans-serif' }}>50000</div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Photos Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-600 counter-number" data-target="14" style={{ fontFamily: 'Outfit, sans-serif' }}>14</div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Pro Filters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-rose-600 counter-number" data-target="6" style={{ fontFamily: 'Outfit, sans-serif' }}>6</div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Layouts</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="features-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-20 px-4">
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
            </div>
           {/* How It Works Section */}
            <div className="mt-16 sm:mt-24 px-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
                How It Works
              </h2>
              <p className="text-center text-gray-600 text-base sm:text-lg mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                Create professional photo strips in just 3 simple steps
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
                <div className="relative text-center p-6 sm:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-100 hover:shadow-xl transition-all">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    1
                  </div>
                  <div className="mt-8">
                    <CameraIcon className="w-16 h-16 mx-auto mb-4 text-pink-500" />
                    <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>Choose & Capture</h3>
                    <p className="text-gray-600 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Select your favorite layout and snap your photos
                    </p>
                  </div>
                </div>

                <div className="relative text-center p-6 sm:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    2
                  </div>
                  <div className="mt-8">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                    <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>Customize</h3>
                    <p className="text-gray-600 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Apply filters, frames, stickers and make it perfect
                    </p>
                  </div>
                </div>

                <div className="relative text-center p-6 sm:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-100 hover:shadow-xl transition-all">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    3
                  </div>
                  <div className="mt-8">
                    <Download className="w-16 h-16 mx-auto mb-4 text-rose-500" />
                    <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>Download & Share</h3>
                    <p className="text-gray-600 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Download high-quality images and share with friends
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Mira Section */}
            <div className="mt-16 sm:mt-24 px-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Why Choose Mira?
              </h2>
              <p className="text-center text-gray-600 text-base sm:text-lg mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                The ultimate online photo booth experience designed for creating memorable moments
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Smile className="text-pink-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        User-Friendly Interface
                      </h3>
                      <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Our intuitive design makes it easy for anyone to create professional-looking photo strips. No technical skills required – just point, click, and create!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="text-purple-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Privacy First
                      </h3>
                      <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Your photos are processed directly in your browser. We don't store or upload your images to any server, ensuring complete privacy and security.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-rose-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-rose-100 to-pink-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Gift className="text-rose-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Completely Free
                      </h3>
                      <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Access all features without any subscription or hidden costs. Create unlimited photo strips, apply all filters, and download as many times as you want!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="text-indigo-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Perfect for Any Occasion
                      </h3>
                      <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Birthdays, weddings, parties, or just fun with friends – our versatile layouts and filters work perfectly for every special moment you want to capture.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials / Reviews */}
            <div className="mt-16 sm:mt-24 px-4">
              <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-rose-50 rounded-3xl p-8 sm:p-12 border-2 border-pink-200 shadow-xl">
                <div className="text-center mb-8">
                  <div className="flex justify-center gap-1 mb-3">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Loved by Thousands
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Join our growing community of happy users who are creating amazing photo booth memories every day. From casual snapshots to professional events, Mira helps everyone capture their best moments.
                  </p>
                </div>
              </div>
            </div>

            {/* Tips and Tricks Section */}
            <div className="mt-16 sm:mt-24 px-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Pro Tips for Amazing Photos
              </h2>
              <p className="text-center text-gray-600 text-base sm:text-lg mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                Master the art of photo booth photography with these expert tips and creative ideas
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
                  <div className="text-3xl mb-3">💡</div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Perfect Your Lighting
                  </h3>
                  <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Natural light works best! Position yourself facing a window or in a well-lit area. Avoid harsh overhead lighting and direct sunlight. Soft, diffused light creates the most flattering photos with even skin tones.
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
                  <div className="text-3xl mb-3">🎨</div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Master Filter Selection
                  </h3>
                  <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Match filters to your occasion! Use vintage filters for nostalgic vibes, warm tones for cozy gatherings, cool filters for modern looks, and black & white for timeless elegance. Preview different options before finalizing.
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-rose-100">
                  <div className="text-3xl mb-3">🎭</div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Express Your Personality
                  </h3>
                  <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Don't be camera shy! Try different expressions and poses. Genuine smiles, silly faces, and natural interactions create the most memorable photos. The best photo booth pictures capture authentic joy.
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-100">
                  <div className="text-3xl mb-3">👥</div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Group Photo Composition
                  </h3>
                  <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    For group shots, arrange people at different heights for visual interest. Ensure everyone fits in frame and faces the camera. Use countdown timers to coordinate poses and capture everyone at their best.
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-teal-100">
                  <div className="text-3xl mb-3">🎬</div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Tell a Story Across Frames
                  </h3>
                  <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Create photo sequences that tell a story! Start with a normal pose, add action in the middle frames, and finish with a fun expression. Sequential storytelling makes your photo strips more engaging and memorable.
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-100">
                  <div className="text-3xl mb-3">✨</div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Use Props Creatively
                  </h3>
                  <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Add personality with creative props! Hats, glasses, signs, or themed accessories enhance your photos. Our sticker feature lets you add digital decorations without physical props. Mix and match for unique results.
                  </p>
                </div>
              </div>
            </div>

            {/* Use Cases Section */}
            <div className="mt-16 sm:mt-24 px-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Perfect for Every Occasion
              </h2>
              <p className="text-center text-gray-600 text-base sm:text-lg mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                From intimate gatherings to grand celebrations, Mira adapts to any event
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 shadow-lg border border-pink-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    🎉 Parties & Celebrations
                  </h3>
                  <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Birthday parties, graduation celebrations, baby showers, and holiday gatherings all come alive with photo booth fun. Create lasting memories with friends and family while everyone enjoys the interactive experience.
                  </p>
                  <ul className="space-y-2 text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-500 mt-1">▸</span>
                      <span>Birthday party entertainment for all ages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-500 mt-1">▸</span>
                      <span>Graduation photo memories with classmates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-500 mt-1">▸</span>
                      <span>Holiday gathering keepsakes for guests</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg border border-purple-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    💑 Weddings & Romance
                  </h3>
                  <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Capture the love and joy of your special day. Perfect for engagement parties, weddings, anniversaries, and romantic date nights. Our heart-themed layout adds an extra touch of romance to your memories.
                  </p>
                  <ul className="space-y-2 text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">▸</span>
                      <span>Wedding reception entertainment for guests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">▸</span>
                      <span>Engagement party photo favors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">▸</span>
                      <span>Anniversary celebration memories</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    🏢 Corporate & Professional Events
                  </h3>
                  <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Add fun to professional gatherings. Team building events, company parties, conferences, and networking sessions become more memorable with photo booth entertainment. Great for employer branding and team morale.
                  </p>
                  <ul className="space-y-2 text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">▸</span>
                      <span>Team building activity and ice breaker</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">▸</span>
                      <span>Conference attendee engagement tool</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">▸</span>
                      <span>Company milestone celebrations</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg border border-amber-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    👨‍👩‍👧‍👦 Family & Everyday Moments
                  </h3>
                  <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Capture everyday joy with your loved ones. Perfect for family reunions, casual hangouts with friends, virtual celebrations, or just documenting special moments at home with the people who matter most.
                  </p>
                  <ul className="space-y-2 text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">▸</span>
                      <span>Family reunion photo traditions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">▸</span>
                      <span>Fun photos with friends at home</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">▸</span>
                      <span>Documenting kids growing up</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16 sm:mt-24 px-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Frequently Asked Questions
              </h2>
              <p className="text-center text-gray-600 text-base sm:text-lg mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                Everything you need to know about using Mira Photo Booth
              </p>

              <div className="max-w-4xl mx-auto space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                  <h3 className="font-bold text-lg text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Is Mira really free to use?
                  </h3>
                  <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Yes! Mira is completely free with no hidden costs, subscriptions, or premium features. You get access to all 6 layouts, 14+ filters, custom frames, stickers, and unlimited downloads without paying anything. We believe everyone should be able to create and preserve their special moments.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                  <h3 className="font-bold text-lg text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Do you store my photos on your servers?
                  </h3>
                  <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    No, we never store your photos! All image processing happens directly in your browser using client-side technology. Your photos never leave your device unless you choose to download or share them. Your privacy and security are our top priorities.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-rose-100">
                  <h3 className="font-bold text-lg text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    What devices and browsers work with Mira?
                  </h3>
                  <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Mira works on all modern browsers including Chrome, Firefox, Safari, and Edge. It's fully responsive and works great on desktop computers, laptops, tablets, and smartphones. You need a device with a camera to capture photos, but you can also upload existing images from your gallery.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
                  <h3 className="font-bold text-lg text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Can I use Mira for commercial events?
                  </h3>
                  <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Absolutely! Mira is perfect for weddings, corporate events, parties, and any commercial gathering. There are no licensing fees or usage restrictions. The photos you create are yours to use however you'd like, including for business purposes.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100">
                  <h3 className="font-bold text-lg text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    What image quality can I expect?
                  </h3>
                  <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Mira exports high-quality PNG images that are perfect for printing and sharing on social media. The final image quality depends on your camera quality, but our processing maintains the original resolution and applies professional-grade filters without compression artifacts.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
                  <h3 className="font-bold text-lg text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Do I need to create an account or sign up?
                  </h3>
                  <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    No signup required! Just visit our website and start creating immediately. There's no need for accounts, email verification, or personal information. We respect your time and privacy, so you can jump straight into creating amazing photo booth memories.
                  </p>
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <div className="mt-16 sm:mt-20 text-center px-4">
              <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-3xl p-8 sm:p-12 shadow-2xl">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Ready to Create Magic? ✨
                </h2>
                <p className="text-white/90 text-base sm:text-lg mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Start creating beautiful photo booth memories now. Completely free, no signup required, and your privacy is always protected!
                </p>
                <button
                  onClick={() => setStep('layout')}
                  className="bg-white text-pink-600 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all inline-flex items-center gap-3"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span>Start Creating Free</span>
                  <Zap size={24} />
                </button>
              </div>
            </div>
          </div>
        )}       
        {/* Layout Selection */}
        {step === 'layout' && (
          <div className="max-w-6xl mx-auto py-8">
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-10 text-gray-800 animate-on-mount px-4"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Choose Your Layout
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 px-4">
              {LAYOUTS.map((layout) => (
                <div key={layout.id} className="relative animate-on-mount">
                  {layout.special && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <span 
                        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xl border-2 border-white animate-pulse"
                        style={{ fontFamily: 'Fredoka, sans-serif' }}
                      >
                        {layout.special}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => handleLayoutSelect(layout)}
                    className="w-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-4 sm:p-6 border-2 border-pink-100 hover:border-pink-300 hover:scale-105"
                  >
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 sm:p-6 h-56 sm:h-72 mb-4 flex items-center justify-center">
                      <LayoutPreview template={layout.template} />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg sm:text-xl mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {layout.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {layout.description}
                    </p>
                  </button>
                </div>
              ))}
            </div>
            <div className="text-center px-4">
              <button
                onClick={() => setStep('home')}
                className="text-pink-500 hover:text-pink-700 font-semibold hover:scale-105 transition-transform text-sm sm:text-base"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                ← Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Camera */}
        {step === 'camera' && selectedLayout && (
          <Camera
            layout={selectedLayout}
            onComplete={handlePhotosCaptured}
            onBack={() => setStep('layout')}
          />
        )}

        {/* Customize */}
        {step === 'customize' && (
          <>
            <div className="max-w-7xl mx-auto py-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                  <PhotoCanvas
                    photos={photos}
                    layout={selectedLayout}
                    filter={currentFilter}
                    frameColor={frameColor}
                    framePattern={framePattern}
                    stickers={stickers}
                    onUpdateStickers={setStickers}
                    canvasRef={finalCanvasRef}
                    onReset={handleReset}
                    onBackToCamera={handleBackToCamera}
                  />
                  
                  <div className="bg-white rounded-xl shadow-lg p-4 border border-pink-200">
                    <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      <Edit2 className="text-pink-500" size={18} />
                      Edit Photos
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {photos.map((photo, idx) => (
                        <button
                          key={idx}
                          onClick={() => setEditingPhotoIndex(idx)}
                          className="relative group flex-shrink-0"
                        >
                          <img
                            src={photo}
                            alt={`Photo ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-pink-200 group-hover:border-pink-400 transition-all"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Edit2 className="text-white" size={16} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="lg:sticky lg:top-20 lg:self-start">
                  <div className="space-y-4 max-h-[600px] lg:max-h-[calc(100vh-120px)] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#f472b6 #fce7f3' }}>
                    <FiltersPanel currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
                    <FrameCustomizer frameColor={frameColor} framePattern={framePattern} onColorChange={setFrameColor} onPatternChange={setFramePattern} />
                    <StickerPanel onAddSticker={addSticker} />
                  </div>
                </div>
              </div>
            </div>

            {editingPhotoIndex !== null && (
              <PhotoEditor
                photo={photos[editingPhotoIndex]}
                index={editingPhotoIndex}
                onSave={handleSaveEditedPhoto}
                onCancel={() => setEditingPhotoIndex(null)}
              />
            )}
          </>
        )}
      </div>
         <footer className="mt-16 bg-gradient-to-br from-pink-100 to-rose-100 py-12 px-4 border-t border-pink-200">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Mira
                </h3>
                <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Creating beautiful photo booth memories, one moment at a time. Your privacy-first, free online photo booth solution.
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
                  <button 
                    onClick={() => setStep('home')}
                    className="block text-gray-600 hover:text-pink-600 text-left" 
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Home
                  </button>
                  <Link to="/about" className="block text-gray-600 hover:text-pink-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    About
                  </Link>
                  <Link to="/contact" className="block text-gray-600 hover:text-pink-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Contact
                  </Link>
                  <Link to="/terms" className="block text-gray-600 hover:text-pink-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Terms & Privacy
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Contact Us
                </h4>
                <div className="space-y-3 text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <a href="mailto:mira.capturemoments@gmail.com" className="hover:text-pink-600">
                      mira.capturemoments@gmail.com
                    </a>
                  </div>
                  <p className="text-sm">
                    We're here to help! Reach out with any questions or feedback.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-pink-200 pt-8 text-center">
              <p className="text-gray-600 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                © 2025 Mira Photo Booth. All rights reserved.
              </p>
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                Made with <Heart className="inline text-pink-500 fill-pink-500" size={14} /> for creating and preserving memories
              </p>
            </div>
          </div>
        </footer>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap');
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
      `}</style>
    </div>
  );
}

// Layout Preview Component
function LayoutPreview({ template }) {
  if (template === 'classic') {
    return (
      <div className="w-full max-w-[180px] sm:max-w-[220px]">
        <div className="bg-gradient-to-br from-pink-200 to-rose-200 p-3 sm:p-4 rounded-xl shadow-inner">
          <div className="space-y-2 sm:space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white h-12 sm:h-16 rounded-lg shadow-md"></div>
            ))}
          </div>
          <div className="text-center text-xs text-gray-600 mt-2 sm:mt-3 font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
            photobooth
          </div>
        </div>
      </div>
    );
  }
  
  if (template === 'aesthetic' || template === 'holiday') {
    return (
      <div className="w-full max-w-[180px] sm:max-w-[220px]">
        <div className="bg-gradient-to-br from-pink-200 to-rose-200 p-3 sm:p-4 rounded-xl shadow-inner">
          <div className="space-y-2 sm:space-y-2.5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white h-9 sm:h-11 rounded-lg shadow-md"></div>
            ))}
          </div>
          <div className="text-center text-xs text-gray-600 mt-2 sm:mt-3 font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
            {template === 'holiday' ? 'holiday special' : '1 col × 4 rows'}
          </div>
        </div>
      </div>
    );
  }
  
  if (template === 'hearts') {
    return (
      <div className="w-full max-w-[180px] sm:max-w-[220px]">
        <div className="bg-gradient-to-br from-pink-200 to-rose-300 p-3 sm:p-4 rounded-xl shadow-inner">
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white h-10 sm:h-12 rounded-full shadow-md border-2 border-pink-400"></div>
            ))}
          </div>
          <div className="text-center text-xs text-pink-700 mt-2 sm:mt-3 font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
            with love 💕
          </div>
        </div>
      </div>
    );
  }
  
  if (template === 'filmstrip') {
    return (
      <div className="w-full max-w-[180px] sm:max-w-[220px]">
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-3 sm:p-4 rounded-xl relative shadow-inner">
          <div className="absolute left-1 top-0 bottom-0 w-2 flex flex-col justify-around py-2 sm:py-3">
            {[1,2,3,4,5,6,7].map(i => <div key={i} className="bg-gray-900 h-1.5 w-2 rounded-sm"></div>)}
          </div>
          <div className="absolute right-1 top-0 bottom-0 w-2 flex flex-col justify-around py-2 sm:py-3">
            {[1,2,3,4,5,6,7].map(i => <div key={i} className="bg-gray-900 h-1.5 w-2 rounded-sm"></div>)}
          </div>
          
          <div className="space-y-2 sm:space-y-3 px-3">
            <div className="bg-white h-16 sm:h-20 rounded shadow-md"></div>
            <div className="bg-white h-16 sm:h-20 rounded shadow-md"></div>
          </div>
          <div className="text-center text-xs text-gray-300 mt-2 sm:mt-3 font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
            retro style
          </div>
        </div>
      </div>
    );
  }
  
  if (template === 'collage') {
    return (
      <div className="w-full max-w-[180px] sm:max-w-[220px]">
        <div className="bg-gradient-to-br from-purple-200 to-pink-200 p-3 sm:p-4 rounded-xl shadow-inner">
          <div className="space-y-2">
            {[1, 2, 3].map(row => (
              <div key={row} className="grid grid-cols-2 gap-2">
                <div className="bg-white h-10 sm:h-12 rounded-lg shadow-md"></div>
                <div className="bg-white h-10 sm:h-12 rounded-lg shadow-md"></div>
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-gray-600 mt-2 sm:mt-3 font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
            3 rows × 2 cols
          </div>
        </div>
      </div>
    );
  }
  
  return null;
}

export default Booth;
