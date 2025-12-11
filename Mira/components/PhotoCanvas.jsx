import React, { useRef, useEffect, useState } from 'react';
import { Trash2, ZoomIn, ZoomOut, Download, RotateCw } from 'lucide-react';

function PhotoCanvas({ photos, layout, filter, frameColor, framePattern, stickers, onUpdateStickers, canvasRef, onReset }) {
  const displayCanvasRef = useRef(null);
  const [draggedSticker, setDraggedSticker] = useState(null);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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

    const ctx = canvas.getContext('2d');
    
    // Responsive canvas sizing
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

    // Apply frame background
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

    // Draw decorative border
    ctx.strokeStyle = frameColor.border;
    ctx.lineWidth = isMobile ? 6 : 8;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Draw pattern if selected
    if (framePattern.id !== 'none') {
      ctx.font = `bold ${isMobile ? 20 : 28}px Arial`;
      ctx.fillStyle = framePattern.color || 'rgba(0, 0, 0, 0.4)';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 2;
      
      const spacing = isMobile ? 30 : 40;
      const borderThickness = isMobile ? 50 : 65;
      
      // Top border
      for (let j = 30; j < borderThickness; j += spacing) {
        for (let i = 30; i < width - 30; i += spacing) {
          ctx.fillText(framePattern.emoji, i, j);
        }
      }
      
      // Bottom border
      for (let j = height - borderThickness + 30; j < height - 20; j += spacing) {
        for (let i = 30; i < width - 30; i += spacing) {
          ctx.fillText(framePattern.emoji, i, j);
        }
      }
      
      // Left border
      for (let i = 30; i < borderThickness; i += spacing) {
        for (let j = borderThickness + 30; j < height - borderThickness; j += spacing) {
          ctx.fillText(framePattern.emoji, i, j);
        }
      }
      
      // Right border
      for (let i = width - borderThickness + 30; i < width - 20; i += spacing) {
        for (let j = borderThickness + 30; j < height - borderThickness; j += spacing) {
          ctx.fillText(framePattern.emoji, i, j);
        }
      }
      
      ctx.shadowBlur = 0;
    }

    const padding = isMobile ? 40 : 50;
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
        img.onload = () => {
          loadedCount++;
          const y = padding + idx * (photoHeight + photoSpacing);
          
          ctx.fillStyle = 'white';
          ctx.fillRect(padding - 8, y - 8, photoWidth + 16, photoHeight + 16);
          
          ctx.save();
          ctx.filter = getFilterStyle(filter);
          
          // Calculate aspect ratio for proper fitting
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
          
          // Proper aspect ratio handling
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
        img.onload = () => {
          loadedCount++;
          const y = padding + idx * (photoHeight + photoSpacing);
          
          // Film sprocket holes
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
          
          // Proper aspect ratio
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
          
          // Proper aspect ratio
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

  const handleDownload = () => {
    const canvas = displayCanvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `mira-photobooth-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
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

  const handleCanvasMouseDown = (e) => {
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
      return Math.sqrt(dx * dx + dy * dy) < size / 2;
    });

    if (clicked) {
      setDraggedSticker(clicked);
      setSelectedSticker(clicked);
    } else {
      setSelectedSticker(null);
    }
  };

  const handleCanvasTouchStart = (e) => {
    const touch = e.touches[0];
    const canvas = displayCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;

    const clicked = stickers.find(s => {
      const dx = x - s.x;
      const dy = y - s.y;
      const size = s.size || 48;
      return Math.sqrt(dx * dx + dy * dy) < size / 2;
    });

    if (clicked) {
      e.preventDefault();
      setDraggedSticker(clicked);
      setSelectedSticker(clicked);
    }
  };

  const handleCanvasMove = (e) => {
    if (!draggedSticker) return;

    const canvas = displayCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let x, y;
    if (e.type.includes('touch')) {
      e.preventDefault();
      const touch = e.touches[0];
      x = (touch.clientX - rect.left) * scaleX;
      y = (touch.clientY - rect.top) * scaleY;
    } else {
      x = (e.clientX - rect.left) * scaleX;
      y = (e.clientY - rect.top) * scaleY;
    }

    onUpdateStickers(stickers.map(s => 
      s.id === draggedSticker.id ? { ...s, x, y } : s
    ));
  };

  const handleCanvasEnd = () => {
    setDraggedSticker(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 border border-pink-200">
      {/* Header */}
      <div className={`${isMobile ? 'sticky top-0 z-10 bg-white pb-3 -mx-3 px-3 pt-3 shadow-sm' : ''} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4`}>
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>Your Photo Strip</h3>
        <div className="flex gap-2 w-full sm:w-auto">
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
            className="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <RotateCw size={16} />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex justify-center bg-gray-50 rounded-lg p-2 sm:p-4 mb-3 sm:mb-4">
        <canvas 
          ref={displayCanvasRef} 
          className="max-w-full h-auto shadow-xl rounded-lg cursor-move" 
          style={{ 
            maxHeight: isMobile ? '65vh' : '500px',
            width: '100%',
            objectFit: 'contain',
            touchAction: 'none'
          }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMove}
          onMouseUp={handleCanvasEnd}
          onMouseLeave={handleCanvasEnd}
          onTouchStart={handleCanvasTouchStart}
          onTouchMove={handleCanvasMove}
          onTouchEnd={handleCanvasEnd}
        />
      </div>

      {/* Sticker Controls */}
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
              Rotate Left
            </button>
            <button
              onClick={() => rotateSticker(selectedSticker.id, 15)}
              className="flex items-center gap-1 bg-white hover:bg-pink-100 px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-sm border border-pink-200"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <RotateCw size={16} />
              Rotate Right
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
            💡 Drag the sticker on the photo to move it around
          </p>
        </div>
      )}

      {/* All Stickers List */}
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