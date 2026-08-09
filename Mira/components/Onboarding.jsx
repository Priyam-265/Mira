import { useState, useEffect } from 'react';
import { X, Key, Shield, CheckCircle, AlertCircle, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'mira-onboarding-done';
const KEYS_CONFIG = [
  { id: 'openrouter', label: 'OpenRouter API Key', placeholder: 'sk-or-v1-...', description: 'Used for AI caption and hashtag generation', required: false },
  { id: 'removebg', label: 'Remove.bg API Key', placeholder: 'Enter your key...', description: 'Used for AI background removal', required: false },
];

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [keys, setKeys] = useState({});
  const [showKeys, setShowKeys] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const existing = {};
    KEYS_CONFIG.forEach(k => {
      const saved = localStorage.getItem(`mira-key-${k.id}`);
      if (saved) existing[k.id] = saved;
    });
    setKeys(existing);
  }, []);

  const toggleShow = (id) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const validateKey = (id, value) => {
    if (!value) return null;
    if (id === 'openrouter' && !value.startsWith('sk-or-')) {
      return 'OpenRouter keys typically start with sk-or-';
    }
    if (id === 'removebg' && value.length < 20) {
      return 'API key seems too short';
    }
    return null;
  };

  const handleKeyChange = (id, value) => {
    setKeys(prev => ({ ...prev, [id]: value }));
    const err = validateKey(id, value);
    setErrors(prev => ({ ...prev, [id]: err }));
  };

  const saveKeys = () => {
    KEYS_CONFIG.forEach(k => {
      const val = keys[k.id] || '';
      if (val) {
        localStorage.setItem(`mira-key-${k.id}`, val);
      } else {
        localStorage.removeItem(`mira-key-${k.id}`);
      }
    });
    localStorage.setItem(STORAGE_KEY, 'true');
    onComplete();
  };

  const skip = () => {
    KEYS_CONFIG.forEach(k => localStorage.removeItem(`mira-key-${k.id}`));
    localStorage.setItem(STORAGE_KEY, 'true');
    onComplete();
  };

  if (step === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Mira</h2>
            <p className="text-pink-100 text-sm">
              Your AI-powered photo booth and creator toolkit
            </p>
          </div>

          <div className="p-8">
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Photo Booth</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Capture and customize photo strips with filters and stickers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Key className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">AI Creator Tools</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Generate captions, hashtags, and remove backgrounds</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Private & Secure</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">API keys stay on your device, never sent to our servers</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={skip}
                className="w-full py-3 text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                <Key className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">API Configuration</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Optional — enables AI features</p>
              </div>
            </div>
            <button onClick={skip} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Your keys are stored locally in your browser and never leave your device. They are used only for direct API calls from your browser.
            </p>
          </div>

          {KEYS_CONFIG.map((keyConfig) => (
            <div key={keyConfig.id}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {keyConfig.label}
                {keyConfig.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{keyConfig.description}</p>
              <div className="relative">
                <input
                  type={showKeys[keyConfig.id] ? 'text' : 'password'}
                  value={keys[keyConfig.id] || ''}
                  onChange={(e) => handleKeyChange(keyConfig.id, e.target.value)}
                  placeholder={keyConfig.placeholder}
                  className={`w-full px-4 py-2.5 pr-10 bg-gray-50 dark:bg-gray-700 border ${
                    errors[keyConfig.id] ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'
                  } rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                />
                <button
                  type="button"
                  onClick={() => toggleShow(keyConfig.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showKeys[keyConfig.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors[keyConfig.id] && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors[keyConfig.id]}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3">
          <button
            onClick={saveKeys}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            Save & Continue
          </button>
          <button
            onClick={skip}
            className="w-full py-3 text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Skip — I will add keys later
          </button>
        </div>
      </div>
    </div>
  );
}

export function getApiKey(id) {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(`mira-key-${id}`) || '';
}

export function isOnboarded() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export default Onboarding;
