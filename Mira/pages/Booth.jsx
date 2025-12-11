import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Camera from '../components/Camera';
import PhotoCanvas from '../components/PhotoCanvas';
import FiltersPanel from '../components/FiltersPanel';
import StickerPanel from '../components/StickerPanel';
import FrameCustomizer from '../components/FrameCustomizer';
import PhotoEditor from '../components/PhotoEditor';
import { Heart, Github, Edit2, Sparkles, Camera as CameraIcon ,Instagram} from 'lucide-react';

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

  const handleLayoutSelect = (layout) => {
    setSelectedLayout(layout);
    setPhotos([]);
    setStep('camera');
  };

  const handlePhotosCaptured = (capturedPhotos) => {
    setPhotos(capturedPhotos);
    setStep('customize');
  };

  const handleReset = () => {
    setPhotos([]);
    setStickers([]);
    setCurrentFilter('none');
    setFrameColor({ id: 'gradient-pink', name: 'Pink Gradient', bg: 'linear-gradient(135deg, #fce7f3, #f9a8d4)', border: '#f472b6' });
    setFramePattern({ id: 'none', name: 'No Pattern', emoji: '⬜', color: 'rgba(0, 0, 0, 0.4)' });
    setSelectedLayout(null);
    setStep('home');
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
          <div className="max-w-5xl mx-auto text-center space-y-10 py-8 sm:py-16">
            <div className="space-y-4 sm:space-y-6 animate-on-mount px-4">
              <h1 
                className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-800 leading-tight"
                style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-2px' }}
              >
                Create Beautiful
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-purple-500">
                  Memories
                </span>
              </h1>
              <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Professional photo booth experience with customizable filters, frames, and stickers. 
                Capture your moments in style.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto animate-on-mount px-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-pink-100">
                <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CameraIcon className="text-pink-500" size={24} />
                </div>
                <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  6 Layouts
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  From classic strips to heart-shaped frames
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-pink-100">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Sparkles className="text-purple-500" size={24} />
                </div>
                <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  14+ Filters
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Professional-grade photo filters
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-pink-100">
                <div className="bg-gradient-to-br from-rose-100 to-pink-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Heart className="text-rose-500 fill-rose-500" size={24} />
                </div>
                <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Custom Frames
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  9 colors & 9 pattern options
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep('layout')}
              className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl text-base sm:text-xl font-bold shadow-2xl hover:shadow-pink-300/50 transition-all hover:scale-110 inline-flex items-center gap-3 animate-on-mount"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span>Get Started</span>
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
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