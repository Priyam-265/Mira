import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Image, Hash, User, FileVideo, Instagram, Mail, Heart, Zap, ArrowRight, Clock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOOLS = [
  {
  id: 'background',
  name: 'AI Background Remover',
  description: 'Remove backgrounds from images instantly with AI',
  icon: Image,
  gradient: 'from-indigo-500 to-purple-500',
  available: true,
  path: '/creatortools/background'
},
    
  {
    id: 'caption',
    name: 'AI Caption Generator',
    description: 'Generate engaging captions that drive engagement',
    icon: Sparkles,
    gradient: 'from-purple-500 to-indigo-500',
    available: true,
    path:'/creatortools/caption'
  },
  {
    id: 'hashtag',
    name: 'AI Hashtag Generator',
    description: 'Find the perfect hashtags to boost your reach',
    icon: Hash,
    gradient: 'from-blue-500 to-cyan-500',
    available: true,
    comingSoon:false,
    path:'/creatortools/hashtag'
  },
  {
    id: 'thumbnail',
    name: 'AI Thumbnail Generator',
    description: 'Create stunning thumbnails for YouTube, Instagram, TikTok & LinkedIn',
    icon: Image,
    gradient: 'from-pink-500 to-rose-500',
    available: false,
    // path: '/creatortools/thumbnail',
    comingSoon:true
  },
  {
    id: 'profile-pic',
    name: 'Profile Pic Enhancer',
    description: 'Enhance and optimize your profile pictures',
    icon: User,
    gradient: 'from-green-500 to-emerald-500',
    available: false,
    comingSoon: true
  },
  {
    id: 'reel-cover',
    name: 'Instagram Reel Covers',
    description: 'Design custom covers for your Instagram reels',
    icon: FileVideo,
    gradient: 'from-orange-500 to-red-500',
    available: false,
    comingSoon: true
  }
];

function CreatorTools() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const heroRef = useRef(null);
  const toolsRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Hero animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.2,
          ease: 'power3.out'
        }
      );
    }

    // Tools grid animation
    if (toolsRef.current) {
      gsap.fromTo(
        toolsRef.current.children,
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: toolsRef.current,
            start: 'top 80%',
          }
        }
      );
    }

    // Stats animation
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
          }
        }
      );
    }
  }, []);

  const handleToolClick = (tool) => {
    if (tool.available) {
      navigate(tool.path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex flex-col">
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
                className="text-base text-pink-600 font-semibold transition-colors"
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

            <button 
              className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className={`w-6 h-0.5 bg-gray-700 rounded-full block origin-center transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-gray-700 rounded-full block origin-center transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-gray-700 rounded-full block origin-center transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-pink-200 shadow-lg overflow-hidden">
            <div className="px-4 py-3 space-y-1">
              <Link 
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Home
              </Link>
              <Link 
                to="/creatortools"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left text-pink-600 bg-pink-50 font-semibold transition-colors py-3 px-4 rounded-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Creator Tools
              </Link>
              <Link 
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                About
              </Link>
              <Link 
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Contact
              </Link>
              <a 
                href="https://www.instagram.com/mira.capturemoments?igsh=ZGEwbXVvdG54aHVw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors py-3 px-4 rounded-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Instagram size={20} />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      <div className="flex-1">
        <div className="bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 text-white py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          
          <div ref={heroRef} className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">AI-Powered Creator Tools</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Create Like a Pro
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
              Transform your content with AI-powered tools designed for creators, marketers, and influencers
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Choose Your Tool
            </h2>
            <p className="text-gray-600 text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
              Professional-grade tools to elevate your content game
            </p>
          </div>

          <div ref={toolsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all ${
                    tool.available 
                      ? 'cursor-pointer hover:shadow-2xl hover:scale-105' 
                      : 'opacity-75 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${tool.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {tool.name}
                  </h3>

                  <p className="text-gray-600 mb-4 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {tool.description}
                  </p>

                  {tool.available ? (
                    <div className="flex items-center gap-2 text-pink-600 font-semibold text-sm">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400 font-semibold text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Coming Soon</span>
                    </div>
                  )}

                  {tool.comingSoon && (
                    <div className="mt-3 inline-block bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold">
                      SOON
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div ref={statsRef} className="mt-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white text-center shadow-2xl">
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Join Thousands of Creators
            </h3>
            <p className="text-pink-100 mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
              Get access to premium AI tools, save time, and create content that stands out
            </p>
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-pink-200 text-sm">Content Created</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">5K+</div>
                <div className="text-pink-200 text-sm">Happy Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">99%</div>
                <div className="text-pink-200 text-sm">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
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
                <Link to="/" className="block text-gray-600 hover:text-pink-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Home
                </Link>
                <Link to="/about" className="block text-gray-600 hover:text-pink-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  About
                </Link>
                <Link to="/creatortools" className="block text-gray-600 hover:text-pink-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Creator Tools
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
    </div>
  );
}

export default CreatorTools;