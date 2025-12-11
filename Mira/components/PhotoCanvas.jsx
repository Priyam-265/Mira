import React, { useRef, useEffect, useState } from 'react';
import { Trash2, ZoomIn, ZoomOut, Download, RotateCw, ArrowLeft, Move } from 'lucide-react';

function PhotoCanvas({ photos, layout, filter, frameColor, framePattern, stickers, onUpdateStickers, canvasRef, onReset, onBackToCamera }) {
  const displayCanvasRef = useRef(null);
  const [draggedSticker, setDraggedSticker] = useState(null);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartDistance, setTouchStartDistance] = useState(null);
  const [touchStartRotation, setTouchStartRotation] = useState(null);
  const [initialStickerSize, setInitialStickerSize] = useState(null);
  const [initialStickerRotation, setInitialStickerRotation] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    renderCanvas();
  }, [photos, filter, frameColor, framePattern, stickers, isMobile]);

  const getFilterStyle = (filterId) => {
    const filters = {
      none: 'none',
      warm: 'sepia(0.3) saturate(1.3) brightness(1.1)',
      vintage: 'sepia(0.6) contrast(1.2) brightness(0.9)',
      cool: 'saturate(0.8) brightness(1.1) hue-rotate(10deg)',
      bw: 'grayscale(1) contrast(1.1)',
      soft: 'blur(0.5px) brightness(1.1)',
      vivid: 'saturate(1.5) contrast(1.2)',
      pastel: 'saturate(0.6) brightness(1.15) contrast(0.9)',
      grayscale: 'grayscale(100%)',
      sepia: 'sepia(100%)',
      sunset: 'sepia(0.4) saturate(1.4) hue-rotate(-10deg)',
      arctic: 'saturate(0.7) brightness(1.2) hue-rotate(180deg)',
      drama: 'contrast(1.3) saturate(1.2) brightness(0.95)',
      retro: 'sepia(0.5) contrast(1.3) saturate(1.1) hue-rotate(-5deg)'
    };
    return filters[filterId] || 'none';
  };

  const renderCanvas = () => {
    const canvas = displayCanvasRef.current;
    if (!canvas || photos.length === 0) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    let width = isMobile ? 400 : 600;
    let height = isMobile ? 800 : 900;
    
    if (layout.template === 'aesthetic' || layout.template === 'holiday') {
      width = isMobile ? 380 : 500;
      height = isMobile ? 900 : 1000;
    } else if (layout.template === 'collage') {
      width = isMobile ? 420 : 650;
      height = isMobile ? 800 : 900;
    } else if (layout.template === 'hearts') {
      width = isMobile ? 400 : 550;
      height = isMobile ? 850 : 950;
    }
    
    canvas.width = width;
    canvas.height = height;

    if (frameColor.bg.startsWith('linear-gradient')) {
      const colors = frameColor.bg.match(/#[0-9a-f]{6}/gi);
      if (colors && colors.length >= 2) {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = '#fce7f3';
      }
    } else {
      ctx.fillStyle = frameColor.bg;
    }
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = frameColor.border;
    ctx.lineWidth = isMobile ? 6 : 8;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    if (framePattern.id !== 'none') {
      const fontSize = isMobile ? 24 : 32;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = framePattern.color || 'rgba(0, 0, 0, 0.4)';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 3;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const spacing = isMobile ? 38 : 48;
      const edgeMargin = 25;
      const borderZoneSize = isMobile ? 60 : 80;
      
      for (let row = 0; row < 2; row++) {
        const y = edgeMargin + (row * spacing) + spacing/2;
        for (let x = edgeMargin + spacing/2; x < width - edgeMargin; x += spacing) {
          ctx.fillText(framePattern.emoji, x, y);
        }
      }
      
      for (let row = 0; row < 2; row++) {
        const y = height - edgeMargin - (row * spacing) - spacing/2;
        for (let x = edgeMargin + spacing/2; x < width - edgeMargin; x += spacing) {
          ctx.fillText(framePattern.emoji, x, y);
        }
      }
      
      for (let col = 0; col < 2; col++) {
        const x = edgeMargin + (col * spacing) + spacing/2;
        for (let y = borderZoneSize + spacing/2; y < height - borderZoneSize; y += spacing) {
          ctx.fillText(framePattern.emoji, x, y);
        }
      }
      
      for (let col = 0; col < 2; col++) {
        const x = width - edgeMargin - (col * spacing) - spacing/2;
        for (let y = borderZoneSize + spacing/2; y < height - borderZoneSize; y += spacing) {
          ctx.fillText(framePattern.emoji, x, y);
        }
      }
      
      ctx.shadowBlur = 0;
      ctx.textAlign = 'start';
      ctx.textBaseline = 'alphabetic';
    }

    const padding = isMobile ? 70 : 90;
    const photoSpacing = isMobile ? 15 : 20;
    let loadedCount = 0;
    const totalPhotos = photos.length;

    const drawStickers = () => {
      stickers.forEach(sticker => {
        ctx.save();
        ctx.translate(sticker.x, sticker.y);
        ctx.rotate((sticker.rotation * Math.PI) / 180);
        const size = sticker.size || 48;
        ctx.font = `${size}px Arial`;
        ctx.fillText(sticker.emoji, -size/2, size/2);
        ctx.restore();
      });
    };

    if (layout.template === 'classic') {
      const photoHeight = (height - padding * 2 - photoSpacing * 2) / 3;
      const photoWidth = width - padding * 2;

      photos.forEach((photo, idx) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          loadedCount++;
          const y = padding + idx * (photoHeight + photoSpacing);
          
          ctx.fillStyle = 'white';
          ctx.fillRect(padding - 8, y - 8, photoWidth + 16, photoHeight + 16);
          
          ctx.save();
          ctx.filter = getFilterStyle(filter);
          
          const imgAspect = img.width / img.height;
          const frameAspect = photoWidth / photoHeight;
          let drawWidth, drawHeight, drawX, drawY;
          
          if (imgAspect > frameAspect) {
            drawHeight = photoHeight;
            drawWidth = photoHeight * imgAspect;
            drawX = padding - (drawWidth - photoWidth) / 2;
            drawY = y;
          } else {
            drawWidth = photoWidth;
            drawHeight = photoWidth / imgAspect;
            drawX = padding;
            drawY = y - (drawHeight - photoHeight) / 2;
          }
          
          ctx.beginPath();
          ctx.rect(padding, y, photoWidth, photoHeight);
          ctx.clip();
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          ctx.restore();
          
          if (loadedCount === totalPhotos) drawStickers();
        };
        img.src = photo;
      });
    } else if (layout.template === 'aesthetic' || layout.template === 'holiday') {
      const availableHeight = height - padding * 2 - (isMobile ? 60 : 80);
      const photoWidth = width - padding * 2 - (isMobile ? 30 : 40);
      const photoHeight = (availableHeight - photoSpacing * 3) / 4;
      
      const startX = (width - photoWidth) / 2;
      const startY = padding + (isMobile ? 30 : 40);
      
      const useRoundedCorners = layout.template === 'holiday';
      const radius = useRoundedCorners ? (isMobile ? 12 : 18) : 0;

      photos.forEach((photo, idx) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          loadedCount++;
          const x = startX;
          const y = startY + idx * (photoHeight + photoSpacing);
          
          ctx.fillStyle = 'white';
          if (useRoundedCorners) {
            ctx.beginPath();
            ctx.roundRect(x - 10, y - 10, photoWidth + 20, photoHeight + 20, radius);
            ctx.fill();
          } else {
            ctx.fillRect(x - 10, y - 10, photoWidth + 20, photoHeight + 20);
          }
          
          ctx.save();
          if (useRoundedCorners) {
            ctx.beginPath();
            ctx.roundRect(x, y, photoWidth, photoHeight, radius - 5);
            ctx.clip();
          } else {
            ctx.beginPath();
            ctx.rect(x, y, photoWidth, photoHeight);
            ctx.clip();
          }
          
          ctx.filter = getFilterStyle(filter);
          
          const imgAspect = img.width / img.height;
          const frameAspect = photoWidth / photoHeight;
          let drawWidth, drawHeight, drawX, drawY;
          
          if (imgAspect > frameAspect) {
            drawHeight = photoHeight;
            drawWidth = photoHeight * imgAspect;
            drawX = x - (drawWidth - photoWidth) / 2;
            drawY = y;
          } else {
            drawWidth = photoWidth;
            drawHeight = photoWidth / imgAspect;
            drawX = x;
            drawY = y - (drawHeight - photoHeight) / 2;
          }
          
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          ctx.restore();
          
          if (loadedCount === totalPhotos) drawStickers();
        };
        img.src = photo;
      });
    } else if (layout.template === 'hearts') {
      const photosToShow = photos.slice(0, 3);
      const baseSize = isMobile ? 140 : 180;
      const scaleMultiplier = 1.40;
      const heartRenderSize = baseSize * scaleMultiplier;
      const spacing = isMobile ? 35 : 45;
      const totalHeartsHeight = (heartRenderSize * 3) + (spacing * 2);
      const startY = (height - totalHeartsHeight) / 2;

      photosToShow.forEach((photo, idx) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          loadedCount++;
          const centerX = width / 2;
          const centerY = startY + (idx * (heartRenderSize + spacing)) + (heartRenderSize / 2);

          ctx.save();
          ctx.beginPath();
          const scale = (baseSize / 100) * scaleMultiplier;
          ctx.translate(centerX, centerY);
          ctx.scale(scale, scale);
          ctx.moveTo(0, -30);
          ctx.bezierCurveTo(25, -55, 60, -35, 60, -5);
          ctx.bezierCurveTo(60, 15, 40, 40, 0, 60);
          ctx.bezierCurveTo(-40, 40, -60, 15, -60, -5);
          ctx.bezierCurveTo(-60, -35, -25, -55, 0, -30);
          ctx.closePath();
          ctx.fillStyle = "white";
          ctx.lineWidth = 5;
          ctx.strokeStyle = "#ec4899";
          ctx.fill();
          ctx.stroke();
          ctx.clip();
          ctx.filter = getFilterStyle(filter);
          const imgAspect = img.width / img.height;
          let drawWidth = 140;
          let drawHeight = 140 / imgAspect;
          if (drawHeight < 140) {
            drawHeight = 140;
            drawWidth = 140 * imgAspect;
          }
          ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
          ctx.restore();
          if (loadedCount === photosToShow.length) drawStickers();
        };
        img.src = photo;
      });
    } else if (layout.template === 'filmstrip') {
      const photoHeight = (height - padding * 2 - photoSpacing) / 2;
      const photoWidth = width - padding * 2;

      photos.forEach((photo, idx) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          loadedCount++;
          const y = padding + idx * (photoHeight + photoSpacing);
          
          ctx.fillStyle = frameColor.border;
          const holeSpacing = isMobile ? 35 : 40;
          for (let i = padding - (isMobile ? 25 : 30); i < height; i += holeSpacing) {
            ctx.fillRect(padding - (isMobile ? 25 : 30), i, isMobile ? 12 : 15, isMobile ? 16 : 20);
            ctx.fillRect(width - padding + (isMobile ? 13 : 15), i, isMobile ? 12 : 15, isMobile ? 16 : 20);
          }
          
          ctx.fillStyle = 'white';
          ctx.fillRect(padding - 8, y - 8, photoWidth + 16, photoHeight + 16);
          
          ctx.save();
          ctx.beginPath();
          ctx.rect(padding, y, photoWidth, photoHeight);
          ctx.clip();
          ctx.filter = getFilterStyle(filter);
          
          const imgAspect = img.width / img.height;
          const frameAspect = photoWidth / photoHeight;
          let drawWidth, drawHeight, drawX, drawY;
          
          if (imgAspect > frameAspect) {
            drawHeight = photoHeight;
            drawWidth = photoHeight * imgAspect;
            drawX = padding - (drawWidth - photoWidth) / 2;
            drawY = y;
          } else {
            drawWidth = photoWidth;
            drawHeight = photoWidth / imgAspect;
            drawX = padding;
            drawY = y - (drawHeight - photoHeight) / 2;
          }
          
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          ctx.restore();
          
          if (loadedCount === totalPhotos) drawStickers();
        };
        img.src = photo;
      });
    } else if (layout.template === 'collage') {
      const gridSpacing = isMobile ? 25 : 35;
      const topBottomMargin = isMobile ? 60 : 80;
      const sideMargin = isMobile ? 40 : 50;
      const availableWidth = width - sideMargin * 2;
      const availableHeight = height - topBottomMargin * 2;
      const photoWidth = (availableWidth - gridSpacing) / 2;
      const photoHeight = (availableHeight - gridSpacing * 2) / 3;
      const startX = sideMargin;
      const startY = topBottomMargin;
      
      photos.forEach((photo, idx) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          loadedCount++;
          const row = Math.floor(idx / 2);
          const col = idx % 2;
          const x = startX + col * (photoWidth + gridSpacing);
          const y = startY + row * (photoHeight + gridSpacing);
          
          ctx.fillStyle = 'white';
          ctx.beginPath();
          const radius = isMobile ? 8 : 10;
          ctx.roundRect(x - 10, y - 10, photoWidth + 20, photoHeight + 20, radius);
          ctx.fill();
          
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(x, y, photoWidth, photoHeight, radius - 3);
          ctx.clip();
          ctx.filter = getFilterStyle(filter);
          
          const imgAspect = img.width / img.height;
          const frameAspect = photoWidth / photoHeight;
          let drawWidth, drawHeight, drawX, drawY;
          
          if (imgAspect > frameAspect) {
            drawHeight = photoHeight;
            drawWidth = photoHeight * imgAspect;
            drawX = x - (drawWidth - photoWidth) / 2;
            drawY = y;
          } else {
            drawWidth = photoWidth;
            drawHeight = photoWidth / imgAspect;
            drawX = x;
            drawY = y - (drawHeight - photoHeight) / 2;
          }
          
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          ctx.restore();
          
          if (loadedCount === totalPhotos) drawStickers();
        };
        img.src = photo;
      });
    }
  };

  const getDistance = (touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getAngle = (touch1, touch2) => {
    return Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX) * 180 / Math.PI;
  };

  const handleDownload = () => {
    const canvas = displayCanvasRef.current;
    if (canvas) {
      try {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `mira-photobooth-${Date.now()}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      } catch (err) {
        const link = document.createElement('a');
        link.download = `mira-photobooth-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }
  };

  const removeSticker = (stickerId) => {
    onUpdateStickers(stickers.filter(s => s.id !== stickerId));
    if (selectedSticker?.id === stickerId) {
      setSelectedSticker(null);
    }
  };

  const resizeSticker = (stickerId, change) => {
    onUpdateStickers(stickers.map(s => {
      if (s.id === stickerId) {
        const currentSize = s.size || 48;
        const newSize = Math.max(24, Math.min(120, currentSize + change));
        return { ...s, size: newSize };
      }
      return s;
    }));
  };

  const rotateSticker = (stickerId, change) => {
    onUpdateStickers(stickers.map(s => {
      if (s.id === stickerId) {
        const currentRotation = s.rotation || 0;
        return { ...s, rotation: (currentRotation + change) % 360 };
      }
      return s;
    }));
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const canvas = displayCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;

      const clicked = stickers.find(s => {
        const dx = x - s.x;
        const dy = y - s.y;
        const size = s.size || 48;
        return Math.sqrt(dx * dx + dy * dy) < size;
      });

      if (clicked) {
        setDraggedSticker(clicked);
        setSelectedSticker(clicked);
      } else {
        setSelectedSticker(null);
      }
    } else if (e.touches.length === 2 && draggedSticker) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      const angle = getAngle(e.touches[0], e.touches[1]);
      setTouchStartDistance(distance);
      setTouchStartRotation(angle);
      setInitialStickerSize(draggedSticker.size || 48);
      setInitialStickerRotation(draggedSticker.rotation || 0);
    }
  };

  const handleTouchMove = (e) => {
    if (!draggedSticker) return;
    e.preventDefault();

    const canvas = displayCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;

      onUpdateStickers(stickers.map(s => 
        s.id === draggedSticker.id ? { ...s, x, y } : s
      ));
    } else if (e.touches.length === 2 && touchStartDistance && touchStartRotation !== null) {
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const currentAngle = getAngle(e.touches[0], e.touches[1]);
      
      const scaleFactor = currentDistance / touchStartDistance;
      const newSize = Math.max(24, Math.min(120, initialStickerSize * scaleFactor));
      
      const angleDiff = currentAngle - touchStartRotation;
      const newRotation = (initialStickerRotation + angleDiff) % 360;

      onUpdateStickers(stickers.map(s => 
        s.id === draggedSticker.id 
          ? { ...s, size: newSize, rotation: newRotation }
          : s
      ));
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    if (e.touches.length === 0) {
      setDraggedSticker(null);
      setTouchStartDistance(null);
      setTouchStartRotation(null);
      setInitialStickerSize(null);
      setInitialStickerRotation(null);
    } else if (e.touches.length === 1) {
      setTouchStartDistance(null);
      setTouchStartRotation(null);
    }
  };

  const handleMouseDown = (e) => {
    const canvas = displayCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const clicked = stickers.find(s => {
      const dx = x - s.x;
      const dy = y - s.y;
      const size = s.size || 48;
      return Math.sqrt(dx * dx + dy * dy) < size;
    });

    if (clicked) {
      setDraggedSticker(clicked);
      setSelectedSticker(clicked);
    } else {
      setSelectedSticker(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!draggedSticker) return;

    const canvas = displayCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    onUpdateStickers(stickers.map(s => 
      s.id === draggedSticker.id ? { ...s, x, y } : s
    ));
  };

  const handleMouseUp = () => {
    setDraggedSticker(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 border border-pink-200">
      <div className={`${isMobile ? 'sticky top-0 z-10 bg-white pb-3 -mx-3 px-3 pt-3 shadow-sm' : ''} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4`}>
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>Your Photo Strip</h3>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          <button
            onClick={onBackToCamera}
            className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <ArrowLeft size={16} />
            <span>Change Photos</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 sm:flex-none bg-gradient-to-r from-pink-400 to-rose-400 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold shadow hover:shadow-lg transition-all hover:scale-105 text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <Download size={16} />
            <span>Download</span>
          </button>
          <button
            onClick={onReset}
            className="flex-1 sm:flex-none bg-red-100 text-red-700 px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-all text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <RotateCw size={16} />
            <span>Restart</span>
          </button>
        </div>
      </div>

      <div className="flex justify-center bg-gray-50 rounded-lg p-2 sm:p-4 mb-3 sm:mb-4">
        <canvas 
          ref={displayCanvasRef} 
          className="max-w-full h-auto shadow-xl rounded-lg cursor-move" 
          style={{ 
            maxHeight: isMobile ? '65vh' : '500px',
            width: '100%',
            objectFit: 'contain',
            touchAction: 'none',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      {isMobile && selectedSticker && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-gray-800 mb-2 text-sm flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            <Move size={18} className="text-blue-500" />
            <span>Touch Gestures</span>
          </h4>
          <ul className="text-xs text-gray-700 space-y-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            <li>👆 <strong>1 finger:</strong> Drag to move</li>
            <li>✌️ <strong>2 fingers:</strong> Pinch to resize & rotate</li>
          </ul>
        </div>
      )}

      {selectedSticker && (
        <div className={`${isMobile ? 'sticky bottom-0 z-10 bg-white pt-3 -mx-3 px-3 pb-3 shadow-lg border-t border-pink-100' : 'mb-4'} bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300 rounded-lg p-4`}>
          <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="text-2xl">{selectedSticker.emoji}</span>
            <span>Sticker Controls</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => resizeSticker(selectedSticker.id, -8)}
              className="flex items-center gap-1 bg-white hover:bg-pink-100 px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-sm border border-pink-200"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <ZoomOut size={16} />
              Smaller
            </button>
            <button
              onClick={() => resizeSticker(selectedSticker.id, 8)}
              className="flex items-center gap-1 bg-white hover:bg-pink-100 px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-sm border border-pink-200"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <ZoomIn size={16} />
              Bigger
            </button>
            <button
              onClick={() => rotateSticker(selectedSticker.id, -15)}
              className="flex items-center gap-1 bg-white hover:bg-pink-100 px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-sm border border-pink-200"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <RotateCw size={16} className="transform -scale-x-100" />
              Left
            </button>
            <button
              onClick={() => rotateSticker(selectedSticker.id, 15)}
              className="flex items-center gap-1 bg-white hover:bg-pink-100 px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-sm border border-pink-200"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <RotateCw size={16} />
              Right
            </button>
            <button
              onClick={() => removeSticker(selectedSticker.id)}
              className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-sm border border-red-300"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isMobile ? '💡 Use 1 finger to move, 2 fingers to resize & rotate' : '💡 Click and drag the sticker to move it'}
          </p>
        </div>
      )}

      {stickers.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            All Stickers ({stickers.length}) {!selectedSticker && <span className="text-pink-500">- Tap to select</span>}
          </h4>
          <div className="flex flex-wrap gap-2">
            {stickers.map(sticker => (
              <button
                key={sticker.id}
                onClick={() => setSelectedSticker(sticker)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  selectedSticker?.id === sticker.id 
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md scale-105' 
                    : 'bg-pink-50 hover:bg-pink-100 border-2 border-pink-200'
                }`}
              >
                <span className="text-xl">{sticker.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoCanvas;