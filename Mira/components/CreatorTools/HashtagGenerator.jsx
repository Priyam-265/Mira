import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Heart, Hash, Copy, ArrowLeft, RefreshCw } from 'lucide-react';
import gsap from 'gsap';

function HashtagGenerator() {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('general');
  const [count, setCount] = useState(15);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHashtags, setGeneratedHashtags] = useState([]);
  const [usage, setUsage] = useState({ used: 0, remaining: 10, total: 10 });
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const API_URL=import.meta.env.VITE_API_URL||'http://localhost:5000';
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const resultRef = useRef(null);
  const loadingRef = useRef(null);

  useEffect(() => {
    fetchUsage();
    
    if (heroRef.current && formRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(
        formRef.current.children,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, []);

  useEffect(() => {
    if (isGenerating && loadingRef.current) {
      gsap.to(loadingRef.current, {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: 'linear'
      });
    }
  }, [isGenerating]);

  useEffect(() => {
    if (generatedHashtags.length > 0 && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, [generatedHashtags]);

  const fetchUsage = async () => {
    try {
      const response = await fetch(`${API_URL}/api/creator/hashtag-usage`);
      const data = await response.json();
      if (data.success) {
        setUsage(data);
      }
    } catch (err) {
      console.error('Failed to fetch usage:', err);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or description');
      return;
    }

    if (usage.remaining <= 0) {
      setError('Daily limit reached! Try again tomorrow.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedHashtags([]);

    try {
      const response = await fetch('http://localhost:5000/api/creator/generate-hashtags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          niche,
          count
        })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedHashtags(data.data.hashtags);
        setUsage(prev => ({
          ...prev,
          used: prev.used + 1,
          remaining: data.data.remaining
        }));
      } else {
        throw new Error(data.message || 'Generation failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate hashtags. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAll = () => {
    const hashtagText = generatedHashtags.join(' ');
    navigator.clipboard.writeText(hashtagText);
    const btn = document.getElementById('copy-all-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Copied!';
    setTimeout(() => {
      btn.innerHTML = originalText;
    }, 2000);
  };

  const handleCopyOne = (hashtag) => {
    navigator.clipboard.writeText(hashtag);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 flex flex-col">
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
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Creator Tools
          </Link>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-green-400 rounded-xl flex items-center justify-center shadow-lg">
                <Hash className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  AI Hashtag Generator
                </h1>
                <p className="text-sm text-gray-600">Boost your reach with perfect hashtags</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl px-4 py-2 border border-teal-200">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-teal-600">{usage.remaining}</span> / {usage.total} remaining
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div ref={heroRef} className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Generate Trending Hashtags
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            AI-powered hashtags to maximize your social media reach
          </p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <p className="text-red-800 text-sm flex-1">{error}</p>
          </div>
        )}

        <div ref={formRef} className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Topic Input */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                What's your content about?
              </h3>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g., Travel photography, Fitness motivation, Food recipes..."
                className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                rows="5"
              />
            </div>

            {/* Niche Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Choose Your Niche
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {['general', 'lifestyle', 'business', 'travel', 'food', 'fitness', 'fashion', 'tech'].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNiche(n)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      niche === n
                        ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {n.charAt(0).toUpperCase() + n.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Count Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Number of Hashtags: {count}
              </h3>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>5</span>
                <span>15</span>
                <span>30</span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || usage.remaining <= 0 || isGenerating}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
                !topic.trim() || usage.remaining <= 0 || isGenerating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 to-green-500 text-white hover:shadow-xl hover:scale-105'
              }`}
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {isGenerating ? (
                <>
                  <div ref={loadingRef}>
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  Generating...
                </>
              ) : (
                <>
                  <Hash className="w-6 h-6" />
                  Generate Hashtags
                </>
              )}
            </button>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            {generatedHashtags.length > 0 ? (
              <div ref={resultRef} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    🏷️ Your Hashtags
                  </h3>
                  <span className="text-sm text-gray-500">{generatedHashtags.length} hashtags</span>
                </div>
                
                <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-6 mb-4 max-h-96 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {generatedHashtags.map((hashtag, index) => (
                      <button
                        key={index}
                        onClick={() => handleCopyOne(hashtag)}
                        className="bg-white px-4 py-2 rounded-lg text-teal-700 font-medium hover:bg-teal-100 transition-all shadow-sm hover:shadow-md"
                        title="Click to copy"
                      >
                        {hashtag}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  id="copy-all-btn"
                  onClick={handleCopyAll}
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  Copy All Hashtags
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
                <Hash className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Your generated hashtags will appear here</p>
              </div>
            )}

            {/* Tips */}
            <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-2xl p-6 border border-teal-200">
              <p className="text-sm text-teal-900 font-medium mb-3">💡 Hashtag best practices:</p>
              <ul className="text-sm text-teal-800 space-y-2">
                <li>• Mix popular and niche hashtags</li>
                <li>• Use 10-15 hashtags per post for optimal reach</li>
                <li>• Research trending hashtags in your niche</li>
                <li>• Avoid banned or spam hashtags</li>
                <li>• Create branded hashtags for your content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-gradient-to-br from-teal-100 to-green-100 py-12 px-4 border-t border-teal-200">
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
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
              >
                <Instagram size={20} />
                Follow us on Instagram
              </a>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/" className="block text-gray-600 hover:text-teal-600">Home</Link>
                <Link to="/about" className="block text-gray-600 hover:text-teal-600">About</Link>
                <Link to="/creatortools" className="block text-gray-600 hover:text-teal-600">Creator Tools</Link>
                <Link to="/contact" className="block text-gray-600 hover:text-teal-600">Contact</Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4">Contact Us</h4>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <a href="mailto:mira.capturemoments@gmail.com" className="hover:text-teal-600">
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

export default HashtagGenerator;