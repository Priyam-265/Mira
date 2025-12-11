import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Upload, Image } from 'lucide-react';

function CameraComponent({ layout, onComplete, onBack }) {
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showEditButton, setShowEditButton] = useState(false);
  const [uploadMode, setUploadMode] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!uploadMode) {
      startCamera();
    }
    return () => {
      stopCamera();
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [uploadMode]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        videoRef.current.muted = true;
        
        await videoRef.current.play().catch(e => console.log('Play error:', e));
        streamRef.current = stream;
        setCameraReady(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please check permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxPhotos = layout.slots - photos.length;
    const filesToProcess = files.slice(0, maxPhotos);

    filesToProcess.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPhotos(prevPhotos => {
            const newPhotos = [...prevPhotos, event.target.result];
            if (newPhotos.length >= layout.slots) {
              setShowEditButton(true);
              stopCamera();
            }
            return newPhotos;
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const startAutoCapture = () => {
    setIsCapturing(true);
    setCurrentPhotoIndex(0);
    startCountdown(0);
  };

  const startCountdown = (photoIndex) => {
    if (photoIndex >= layout.slots) {
      setIsCapturing(false);
      return;
    }

    setCurrentPhotoIndex(photoIndex);
    setCountdown(3);
    
    let currentCount = 3;
    
    countdownIntervalRef.current = setInterval(() => {
      currentCount--;
      setCountdown(currentCount);
      
      if (currentCount === 0) {
        clearInterval(countdownIntervalRef.current);
        setTimeout(() => {
          performCapture(photoIndex);
        }, 200);
      }
    }, 1000);
  };

  const performCapture = (photoIndex) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) {
      console.error('Video or canvas not available');
      return;
    }
    
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      console.error('Video not ready');
      return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Flip horizontally to match what user sees in mirrored preview
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();
    
    const photoData = canvas.toDataURL('image/jpeg', 0.95);
    
    setPhotos(prevPhotos => {
      const newPhotos = [...prevPhotos, photoData];
      
      if (newPhotos.length >= layout.slots) {
        setIsCapturing(false);
        stopCamera();
        setShowEditButton(true);
      } else {
        setTimeout(() => {
          startCountdown(photoIndex + 1);
        }, 1500);
      }
      
      return newPhotos;
    });
  };

  const retake = () => {
    setPhotos([]);
    setIsCapturing(false);
    setCountdown(0);
    setCurrentPhotoIndex(0);
    setShowEditButton(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (!cameraReady && !uploadMode) startCamera();
  };

  const deletePhoto = (index) => {
    const newPhotos = photos.filter((_, idx) => idx !== index);
    setPhotos(newPhotos);
    if (newPhotos.length < layout.slots) {
      setShowEditButton(false);
    }
  };

  const progress = (photos.length / layout.slots) * 100;

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-3 sm:p-6 border border-pink-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <button 
            onClick={onBack} 
            className="w-full sm:w-auto text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2 font-semibold transition-all hover:scale-105 py-2 sm:py-0"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <X size={18} /> Back to Layouts
          </button>
          
          <div className="text-center flex-1 w-full">
            <div 
              className="text-xl sm:text-2xl font-bold text-pink-500"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {photos.length} / {layout.slots}
            </div>
            <div className="w-full sm:w-48 mx-auto mt-2 bg-pink-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-400 to-rose-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <button 
            onClick={retake} 
            className="w-full sm:w-auto text-pink-500 hover:text-pink-700 flex items-center justify-center gap-2 font-semibold transition-all hover:scale-105 py-2 sm:py-0"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <RefreshCw size={18} /> Retake
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setUploadMode(false); }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              !uploadMode 
                ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <Camera size={18} />
            <span className="text-sm sm:text-base">Camera</span>
          </button>
          <button
            onClick={() => { setUploadMode(true); stopCamera(); }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              uploadMode 
                ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <Upload size={18} />
            <span className="text-sm sm:text-base">Upload</span>
          </button>
        </div>

        {!uploadMode ? (
          <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video mb-4 sm:mb-6">
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white p-4 text-center z-20">
                <div>
                  <Camera size={36} className="sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-base sm:text-xl" style={{ fontFamily: 'Inter, sans-serif' }}>{error}</p>
                </div>
              </div>
            )}
            
            {countdown > 0 && isCapturing && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-sm rounded-full w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center shadow-2xl border-4 border-white/30">
                  <div 
                    className="text-white text-5xl sm:text-6xl font-bold animate-pulse"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    {countdown}
                  </div>
                </div>
              </div>
            )}
            
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            
            {!cameraReady && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white z-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-pink-400 mx-auto mb-4"></div>
                  <p className="text-base sm:text-xl px-4" style={{ fontFamily: 'Inter, sans-serif' }}>Loading camera...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl overflow-hidden aspect-video mb-4 sm:mb-6 border-2 border-dashed border-pink-300">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <Image size={48} className="text-pink-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Upload Photos
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Choose up to {layout.slots - photos.length} photo{layout.slots - photos.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={photos.length >= layout.slots}
                className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Upload size={20} />
                Select Photos
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {photos.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
              {photos.map((photo, idx) => (
                <div key={idx} className="flex-shrink-0 relative">
                  <img
                    src={photo}
                    alt={`Photo ${idx + 1}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border-2 border-pink-300 shadow-md"
                  />
                  <button
                    onClick={() => deletePhoto(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-all transform hover:scale-110"
                    title="Delete photo"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {Array.from({ length: layout.slots - photos.length }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-pink-50 rounded-lg border-2 border-dashed border-pink-300 flex items-center justify-center flex-shrink-0"
                >
                  {uploadMode ? <Image className="text-pink-300" size={20} /> : <Camera className="text-pink-300" size={20} />}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {!uploadMode && (
            <button
              onClick={startAutoCapture}
              disabled={isCapturing || !cameraReady || photos.length >= layout.slots}
              className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Camera size={20} />
              {isCapturing ? 'Capturing...' : photos.length >= layout.slots ? 'All Captured' : 'Start Session'}
            </button>
          )}

          {uploadMode && photos.length < layout.slots && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Upload size={20} />
              Add More Photos
            </button>
          )}

          {showEditButton && (
            <button
              onClick={() => onComplete(photos)}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-400 text-white py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Continue to Customize
            </button>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default CameraComponent;