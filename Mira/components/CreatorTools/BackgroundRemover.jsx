import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Heart, Sparkles, Download, ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import gsap from 'gsap';

function BackgroundRemover() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [usage, setUsage] = useState({ used: 0, remaining: 2, total: 2 });
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const API_URL=import.meta.env.VITE_API_URL||'http://localhost:5000';
  const heroRef = useRef(null);
  const uploadRef = useRef(null);
  const resultRef = useRef(null);
  const loadingRef = useRef(null);

  useEffect(() => {
    fetchUsage();
    
    if (heroRef.current && uploadRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(
        uploadRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 }
      );
    }
  }, []);

  useEffect(() => {
    if (isProcessing && loadingRef.current) {
      gsap.to(loadingRef.current, {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: 'linear'
      });
    }
  }, [isProcessing]);

  useEffect(() => {
    if (processedImage && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [processedImage]);

  const fetchUsage = async () => {
    try {
      const response = await fetch(`${API_URL}/api/creator/bg-removal-usage`);
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
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setError('');
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveBackground = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first');
      return;
    }

    if (usage.remaining <= 0) {
      setError('Daily limit reached! You can remove 2 backgrounds per day. Try again tomorrow.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setProcessedImage(null);

    try {
      const formData = new FormData();
      formData.append('image', uploadedImage);

      const response = await fetch(`${API_URL}/api/creator/remove-background`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setProcessedImage(data.data.imageUrl);
        setUsage(prev => ({
          ...prev,
          used: prev.used + 1,
          remaining: data.data.remaining
        }));
      } else {
        throw new Error(data.message || 'Background removal failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to remove background. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `mira-no-bg-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setProcessedImage(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
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

      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to="/creatortools" 
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Creator Tools
          </Link>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  AI Background Remover
                </h1>
                <p className="text-sm text-gray-600">Remove backgrounds with one click</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl px-4 py-2 border border-indigo-200">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-indigo-600">{usage.remaining}</span> / {usage.total} remaining today
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div ref={heroRef} className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Remove Backgrounds Instantly
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Professional background removal powered by AI
          </p>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <p className="text-red-800 text-sm flex-1">{error}</p>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              <X size={18} />
            </button>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {!imagePreview ? (
            // Upload Section
            <div ref={uploadRef} className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-indigo-300 rounded-2xl p-16 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                  <Upload className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                  <p className="text-xl font-bold text-gray-800 mb-2">Click to upload image</p>
                  <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <p className="text-sm text-indigo-900 font-medium mb-3">⏰ First-time requests may take 30-60 seconds as our server wakes up. Subsequent requests will be instant!</p>
                <p className="text-sm text-indigo-900 font-medium mb-3">✨ Perfect for:</p>
                <ul className="text-sm text-indigo-800 space-y-2">
                  <li>• Product photography</li>
                  <li>• Profile pictures</li>
                  <li>• Social media content</li>
                  <li>• E-commerce listings</li>
                  <li>• Creative projects</li>
                </ul>
              </div>
            </div>
          ) : (
            // Processing & Result Section
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-indigo-500" />
                    Original Image
                  </h3>
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Original"
                      className="w-full h-64 object-contain rounded-xl bg-gray-50"
                    />
                  </div>
                </div>

                {/* Processed Image */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    Background Removed
                  </h3>
                  <div className="relative">
                    {isProcessing ? (
                      <div className="w-full h-64 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <div className="text-center">
                          <div ref={loadingRef} className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-indigo-700 font-medium">Processing...</p>
                        </div>
                      </div>
                    ) : processedImage ? (
                      <div ref={resultRef}>
                        <img
                          src={processedImage}
                          alt="Processed"
                          className="w-full h-64 object-contain rounded-xl"
                          style={{
                            backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)',
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 10px 10px'
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-64 rounded-xl bg-gray-50 flex items-center justify-center">
                        <p className="text-gray-400">Result will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {!processedImage && !isProcessing && (
                  <button
                    onClick={handleRemoveBackground}
                    disabled={usage.remaining <= 0}
                    className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
                      usage.remaining <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-xl hover:scale-105'
                    }`}
                  >
                    <Sparkles className="w-6 h-6" />
                    Remove Background
                  </button>
                )}

                {processedImage && (
                  <>
                    <button
                      onClick={handleDownload}
                      className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download Image
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                    >
                      Upload New
                    </button>
                  </>
                )}

                {!processedImage && (
                  <button
                    onClick={handleReset}
                    className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 border-t border-indigo-200">
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
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <Instagram size={20} />
                Follow us on Instagram
              </a>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/" className="block text-gray-600 hover:text-indigo-600">Home</Link>
                <Link to="/about" className="block text-gray-600 hover:text-indigo-600">About</Link>
                <Link to="/creatortools" className="block text-gray-600 hover:text-indigo-600">Creator Tools</Link>
                <Link to="/contact" className="block text-gray-600 hover:text-indigo-600">Contact</Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4">Contact Us</h4>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <a href="mailto:mira.capturemoments@gmail.com" className="hover:text-indigo-600">
                  mira.capturemoments@gmail.com
                </a>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
            Made with <Heart className="inline text-pink-500 fill-pink-500" size={14} /> for creating and preserving memories
          </p>
        </div>
      </footer>
    </div>
  );
}

export default BackgroundRemover;