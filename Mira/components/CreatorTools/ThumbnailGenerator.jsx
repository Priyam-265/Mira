import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Upload, X, Instagram, Mail, Heart, Image as ImageIcon } from 'lucide-react';
import gsap from 'gsap';
import UsageTracker from '../CreatorTools/UsageTracker';
import PlatformSelector from '../CreatorTools/PlatformSelector';
import ThumbnailEditor from '../CreatorTools/ThumbnailEditor';
import GeneratedResult from '../CreatorTools/GeneratedResult';

function ThumbnailGenerator() {
  const [step, setStep] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userIdea, setUserIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [usage, setUsage] = useState({ used: 0, remaining: 3, total: 3 });
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const loadingRef = useRef(null);
  const API_URL=import.meta.env.VITE_API_URL||'http://localhost:5000';
  useEffect(() => {
    fetchUsage();
  }, []);

  useEffect(() => {
    if (step === 1 && heroRef.current && cardsRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [step]);

  useEffect(() => {
    if (step === 2 && loadingRef.current) {
      gsap.to(loadingRef.current, {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: 'linear'
      });
    }
  }, [step]);

  const fetchUsage = async () => {
    try {
      const response = await fetch(`${API_URL}/api/creator/usage`);
      const data = await response.json();
      if (data.success) {
        setUsage(data);
      }
    } catch (err) {
      console.error('Failed to fetch usage:', err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedImage || !userIdea.trim()) {
      setError('Please upload an image and provide your idea');
      return;
    }

    if (usage.remaining <= 0) {
      setError('Daily limit reached! Sign up for more generations.');
      return;
    }

    setIsGenerating(true);
    setStep(2);
    setError('');

    try {
const response = await fetch(`${API_URL}/api/creator/generate`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userIdea,
    platform: selectedPlatform,
    imageUrl: imagePreview,
    simpleMode: simpleMode  // ← Add this
  })
});

      const data = await response.json();

      if (data.success) {
        setGeneratedData(data.data);
        setUsage(prev => ({
          ...prev,
          used: prev.used + 1,
          remaining: data.data.remaining
        }));
        setStep(3);
      } else {
        throw new Error(data.message || 'Generation failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate. Please try again.');
      setStep(1);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedData?.thumbnail) return;
    
    const link = document.createElement('a');
    link.href = generatedData.thumbnail;
    link.download = `${selectedPlatform}-thumbnail-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegenerate = () => {
    setGeneratedData(null);
    setStep(1);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setUserIdea('');
    setGeneratedData(null);
    setStep(1);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex flex-col">
      {/* Navbar */}
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

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  AI Thumbnail Generator
                </h1>
                <p className="text-sm text-gray-600">Create stunning thumbnails in seconds</p>
              </div>
            </div>
            
            <UsageTracker usage={usage} />
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {step === 1 && (
          <>
            <div ref={heroRef} className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Create Your Perfect Thumbnail
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Upload your photo, describe your vision, and let AI do the magic
              </p>
            </div>

            {error && (
              <div className="max-w-3xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-red-800 text-sm flex-1">{error}</p>
                <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
                  <X size={18} />
                </button>
              </div>
            )}

            <div ref={cardsRef} className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div className="space-y-6">
                <PlatformSelector 
                  selectedPlatform={selectedPlatform}
                  onSelect={setSelectedPlatform}
                />

                {/* Image Upload */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    <Upload className="w-5 h-5 text-pink-500" />
                    Upload Base Image
                  </h3>
                  
                  {!imagePreview ? (
                    <label className="block">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium mb-1">Click to upload image</p>
                        <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => {
                          setUploadedImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <ThumbnailEditor 
  userIdea={userIdea}
  setUserIdea={setUserIdea}
  simpleMode={simpleMode}
  setSimpleMode={setSimpleMode}
/>

                <button
                  onClick={handleGenerate}
                  disabled={!uploadedImage || !userIdea.trim() || usage.remaining <= 0}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
                    !uploadedImage || !userIdea.trim() || usage.remaining <= 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-xl hover:scale-105'
                  }`}
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  <Sparkles className="w-6 h-6" />
                  Generate Thumbnail & Caption
                </button>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
              <div ref={loadingRef} className="w-20 h-20 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Creating Magic ✨
              </h3>
              <p className="text-gray-600 mb-6">AI is crafting your perfect thumbnail...</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && generatedData && (
          <GeneratedResult
            generatedData={generatedData}
            platform={selectedPlatform}
            onDownload={handleDownload}
            onRegenerate={handleRegenerate}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-gradient-to-br from-pink-100 to-rose-100 py-12 px-4 border-t border-pink-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Mira
              </h3>
              <p className="text-gray-600 mb-4">
                Creating beautiful content, one moment at a time.
              </p>
              <a 
                href="https://www.instagram.com/mira.capturemoments?igsh=ZGEwbXVvdG54aHVw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
              >
                <Instagram size={20} />
                Follow us on Instagram
              </a>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/" className="block text-gray-600 hover:text-pink-600">Home</Link>
                <Link to="/about" className="block text-gray-600 hover:text-pink-600">About</Link>
                <Link to="/creatortools" className="block text-gray-600 hover:text-pink-600">Creator Tools</Link>
                <Link to="/contact" className="block text-gray-600 hover:text-pink-600">Contact</Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4">Contact Us</h4>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <a href="mailto:mira.capturemoments@gmail.com" className="hover:text-pink-600">
                  mira.capturemoments@gmail.com
                </a>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Made with <Heart className="inline text-pink-500 fill-pink-500" size={14} /> for creating and preserving memories
            </p>
          </div>
      </footer>
    </div>
  );
}
export default ThumbnailGenerator;