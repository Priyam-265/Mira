import React, { useState, useRef, useEffect } from 'react';
import { Camera as CameraIcon, RefreshCw, X, Edit } from 'lucide-react';

function Camera({ layout, onComplete, onBack }) {
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showEditButton, setShowEditButton] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraReady(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
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
        // Wait a brief moment to show 0, then capture
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
    
    // Clear canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Mirror and draw the image
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // Convert to data URL
    const photoData = canvas.toDataURL('image/jpeg', 0.95);
    
    // Update photos array
    setPhotos(prevPhotos => {
      const newPhotos = [...prevPhotos, photoData];
      
      // Check if we've captured all photos
      if (newPhotos.length >= layout.slots) {
        setIsCapturing(false);
        stopCamera();
        setShowEditButton(true);
      } else {
        // Wait before starting next countdown
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
    if (!cameraReady) startCamera();
  };

  const progress = (photos.length / layout.slots) * 100;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 border border-pink-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onBack} 
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2 font-semibold transition-all hover:scale-105"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <X size={20} /> Cancel
          </button>
          <div className="text-center flex-1">
            <div 
              className="text-2xl font-bold text-pink-500"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {photos.length} / {layout.slots}
            </div>
            <div className="w-48 mx-auto mt-2 bg-pink-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-400 to-rose-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <button 
            onClick={retake} 
            className="text-pink-500 hover:text-pink-700 flex items-center gap-2 font-semibold transition-all hover:scale-105"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <RefreshCw size={20} /> Retake
          </button>
        </div>

        {/* Camera View */}
        <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video mb-6">
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white p-4 text-center z-20">
              <div>
                <CameraIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl" style={{ fontFamily: 'Inter, sans-serif' }}>{error}</p>
              </div>
            </div>
          )}
          
          {/* Small Countdown in Center */}
          {countdown > 0 && isCapturing && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-sm rounded-full w-32 h-32 flex items-center justify-center shadow-2xl border-4 border-white/30">
                <div 
                  className="text-white text-6xl font-bold animate-pulse"
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
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-400 mx-auto mb-4"></div>
                <p className="text-xl" style={{ fontFamily: 'Inter, sans-serif' }}>Loading camera...</p>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {photos.length > 0 && (
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {photos.map((photo, idx) => (
              <div key={idx} className="flex-shrink-0">
                <img
                  src={photo}
                  alt={`Captured ${idx + 1}`}
                  className="w-24 h-24 object-cover rounded-lg border-2 border-pink-300 shadow-md"
                />
              </div>
            ))}
            {Array.from({ length: layout.slots - photos.length }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="w-24 h-24 bg-pink-50 rounded-lg border-2 border-dashed border-pink-300 flex items-center justify-center flex-shrink-0"
              >
                <CameraIcon className="text-pink-300" size={24} />
              </div>
            ))}
          </div>
        )}

        {/* Capture Button */}
        <div className="space-y-3">
          <button
            onClick={startAutoCapture}
            disabled={isCapturing || !cameraReady || photos.length >= layout.slots}
            className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <CameraIcon size={24} />
            {isCapturing ? 'Capturing Photos...' : photos.length >= layout.slots ? 'All Photos Captured' : 'Start Photo Session'}
          </button>

          {/* Edit & Continue Buttons */}
          {showEditButton && (
            <div className="flex gap-3">
              <button
                onClick={() => onComplete(photos)}
                className="flex-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Continue to Customize
              </button>
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default Camera;