import React, { useState, useRef, useEffect } from 'react';
import { X, Check, RotateCcw, Crop, Move } from 'lucide-react';

function PhotoEditor({ photo, index, onSave, onCancel }) {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [exposure, setExposure] = useState(100);
  const [shadows, setShadows] = useState(0);
  const [highlights, setHighlights] = useState(0);
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeHandle, setActiveHandle] = useState(null); // 'move', 'tl', 'tr', 'bl', 'br', 'top', 'bottom', 'left', 'right'
  
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      renderPreview();
    };
    img.crossOrigin = "anonymous";
    img.src = photo;
  }, [photo]);

  useEffect(() => {
    if (imageRef.current) {
      renderPreview();
    }
  }, [brightness, contrast, saturation, exposure, shadows, highlights, cropArea]);

  const renderPreview = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = 800;
    canvas.height = 600;

    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) brightness(${exposure}%)`;
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

    if (shadows !== 0) {
      ctx.globalCompositeOperation = 'overlay';
      const shadowEffect = Math.abs(shadows) / 100;
      ctx.fillStyle = shadows > 0 ? `rgba(0,0,0,${shadowEffect})` : `rgba(255,255,255,${shadowEffect})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }

    if (highlights !== 0) {
      ctx.globalCompositeOperation = 'screen';
      const highlightEffect = Math.abs(highlights) / 100;
      ctx.fillStyle = highlights > 0 ? `rgba(255,255,255,${highlightEffect * 0.5})` : `rgba(0,0,0,${highlightEffect * 0.5})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }

    if (cropMode) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const cropX = x + (cropArea.x / 100) * scaledWidth;
      const cropY = y + (cropArea.y / 100) * scaledHeight;
      const cropW = (cropArea.width / 100) * scaledWidth;
      const cropH = (cropArea.height / 100) * scaledHeight;
      
      ctx.clearRect(cropX, cropY, cropW, cropH);
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) brightness(${exposure}%)`;
      ctx.drawImage(
        img,
        (cropArea.x / 100) * img.width,
        (cropArea.y / 100) * img.height,
        (cropArea.width / 100) * img.width,
        (cropArea.height / 100) * img.height,
        cropX,
        cropY,
        cropW,
        cropH
      );
      
      // Draw border
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(cropX, cropY, cropW, cropH);
      ctx.setLineDash([]);
      
      // Draw corner handles
      const handleSize = 16;
      ctx.fillStyle = '#f472b6';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      
      // Top-left
      ctx.fillRect(cropX - handleSize/2, cropY - handleSize/2, handleSize, handleSize);
      ctx.strokeRect(cropX - handleSize/2, cropY - handleSize/2, handleSize, handleSize);
      
      // Top-right
      ctx.fillRect(cropX + cropW - handleSize/2, cropY - handleSize/2, handleSize, handleSize);
      ctx.strokeRect(cropX + cropW - handleSize/2, cropY - handleSize/2, handleSize, handleSize);
      
      // Bottom-left
      ctx.fillRect(cropX - handleSize/2, cropY + cropH - handleSize/2, handleSize, handleSize);
      ctx.strokeRect(cropX - handleSize/2, cropY + cropH - handleSize/2, handleSize, handleSize);
      
      // Bottom-right
      ctx.fillRect(cropX + cropW - handleSize/2, cropY + cropH - handleSize/2, handleSize, handleSize);
      ctx.strokeRect(cropX + cropW - handleSize/2, cropY + cropH - handleSize/2, handleSize, handleSize);
      
      // Draw edge handles (middle of each side)
      const edgeHandleSize = 12;
      ctx.fillStyle = '#f472b6';
      
      // Top
      ctx.fillRect(cropX + cropW/2 - edgeHandleSize/2, cropY - edgeHandleSize/2, edgeHandleSize, edgeHandleSize);
      ctx.strokeRect(cropX + cropW/2 - edgeHandleSize/2, cropY - edgeHandleSize/2, edgeHandleSize, edgeHandleSize);
      
      // Bottom
      ctx.fillRect(cropX + cropW/2 - edgeHandleSize/2, cropY + cropH - edgeHandleSize/2, edgeHandleSize, edgeHandleSize);
      ctx.strokeRect(cropX + cropW/2 - edgeHandleSize/2, cropY + cropH - edgeHandleSize/2, edgeHandleSize, edgeHandleSize);
      
      // Left
      ctx.fillRect(cropX - edgeHandleSize/2, cropY + cropH/2 - edgeHandleSize/2, edgeHandleSize, edgeHandleSize);
      ctx.strokeRect(cropX - edgeHandleSize/2, cropY + cropH/2 - edgeHandleSize/2, edgeHandleSize, edgeHandleSize);
      
      // Right
      ctx.fillRect(cropX + cropW - edgeHandleSize/2, cropY + cropH/2 - edgeHandleSize/2, edgeHandleSize, edgeHandleSize);
      ctx.strokeRect(cropX + cropW - edgeHandleSize/2, cropY + cropH/2 - edgeHandleSize/2, edgeHandleSize, edgeHandleSize);
    }

    ctx.filter = 'none';
  };

  const getEventCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    return { x, y };
  };

  const getHandleAtPosition = (x, y) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return null;

    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const offsetX = (canvas.width - img.width * scale) / 2;
    const offsetY = (canvas.height - img.height * scale) / 2;
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    const cropX = ((offsetX + (cropArea.x / 100) * scaledWidth) / canvas.width) * 100;
    const cropY = ((offsetY + (cropArea.y / 100) * scaledHeight) / canvas.height) * 100;
    const cropW = ((cropArea.width / 100) * scaledWidth / canvas.width) * 100;
    const cropH = ((cropArea.height / 100) * scaledHeight / canvas.height) * 100;

    const handleThreshold = 3;
    
    // Check corners first
    if (Math.abs(x - cropX) < handleThreshold && Math.abs(y - cropY) < handleThreshold) return 'tl';
    if (Math.abs(x - (cropX + cropW)) < handleThreshold && Math.abs(y - cropY) < handleThreshold) return 'tr';
    if (Math.abs(x - cropX) < handleThreshold && Math.abs(y - (cropY + cropH)) < handleThreshold) return 'bl';
    if (Math.abs(x - (cropX + cropW)) < handleThreshold && Math.abs(y - (cropY + cropH)) < handleThreshold) return 'br';
    
    // Check edges
    if (Math.abs(x - (cropX + cropW/2)) < handleThreshold && Math.abs(y - cropY) < handleThreshold) return 'top';
    if (Math.abs(x - (cropX + cropW/2)) < handleThreshold && Math.abs(y - (cropY + cropH)) < handleThreshold) return 'bottom';
    if (Math.abs(x - cropX) < handleThreshold && Math.abs(y - (cropY + cropH/2)) < handleThreshold) return 'left';
    if (Math.abs(x - (cropX + cropW)) < handleThreshold && Math.abs(y - (cropY + cropH/2)) < handleThreshold) return 'right';
    
    // Check if inside crop area (for moving)
    if (x >= cropX && x <= cropX + cropW && y >= cropY && y <= cropY + cropH) return 'move';
    
    return null;
  };

 const handlePointerDown = (e) => {
    if (!cropMode) return;
    
    const coords = getEventCoordinates(e);
    const handle = getHandleAtPosition(coords.x, coords.y);
    
    if (handle) {
      e.preventDefault();
      setIsDragging(true);
      setActiveHandle(handle);
      setDragStart(coords);
    }
  };

  const handlePointerMove = (e) => {
    if (!cropMode) return;
    
    const coords = getEventCoordinates(e);
    
    // Update cursor based on handle
    if (!isDragging) {
      const handle = getHandleAtPosition(coords.x, coords.y);
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      if (handle === 'move') canvas.style.cursor = 'move';
      else if (handle === 'tl' || handle === 'br') canvas.style.cursor = 'nwse-resize';
      else if (handle === 'tr' || handle === 'bl') canvas.style.cursor = 'nesw-resize';
      else if (handle === 'top' || handle === 'bottom') canvas.style.cursor = 'ns-resize';
      else if (handle === 'left' || handle === 'right') canvas.style.cursor = 'ew-resize';
      else canvas.style.cursor = 'default';
      return;
    }
    
    e.preventDefault();
    
    const deltaX = coords.x - dragStart.x;
    const deltaY = coords.y - dragStart.y;
    
    const minSize = 10; // Minimum crop size in percentage
    
    setCropArea(prev => {
      let newArea = { ...prev };
      
      switch (activeHandle) {
        case 'move':
          newArea.x = Math.max(0, Math.min(100 - prev.width, prev.x + deltaX));
          newArea.y = Math.max(0, Math.min(100 - prev.height, prev.y + deltaY));
          break;
          
        case 'tl':
          const newWidthTL = prev.width - deltaX;
          const newHeightTL = prev.height - deltaY;
          if (newWidthTL >= minSize && prev.x + deltaX >= 0) {
            newArea.x = prev.x + deltaX;
            newArea.width = newWidthTL;
          }
          if (newHeightTL >= minSize && prev.y + deltaY >= 0) {
            newArea.y = prev.y + deltaY;
            newArea.height = newHeightTL;
          }
          break;
          
        case 'tr':
          const newWidthTR = prev.width + deltaX;
          const newHeightTR = prev.height - deltaY;
          if (newWidthTR >= minSize && prev.x + newWidthTR <= 100) {
            newArea.width = newWidthTR;
          }
          if (newHeightTR >= minSize && prev.y + deltaY >= 0) {
            newArea.y = prev.y + deltaY;
            newArea.height = newHeightTR;
          }
          break;
          
        case 'bl':
          const newWidthBL = prev.width - deltaX;
          const newHeightBL = prev.height + deltaY;
          if (newWidthBL >= minSize && prev.x + deltaX >= 0) {
            newArea.x = prev.x + deltaX;
            newArea.width = newWidthBL;
          }
          if (newHeightBL >= minSize && prev.y + newHeightBL <= 100) {
            newArea.height = newHeightBL;
          }
          break;
          
        case 'br':
          const newWidthBR = prev.width + deltaX;
          const newHeightBR = prev.height + deltaY;
          if (newWidthBR >= minSize && prev.x + newWidthBR <= 100) {
            newArea.width = newWidthBR;
          }
          if (newHeightBR >= minSize && prev.y + newHeightBR <= 100) {
            newArea.height = newHeightBR;
          }
          break;
          
        case 'top':
          const newHeightTop = prev.height - deltaY;
          if (newHeightTop >= minSize && prev.y + deltaY >= 0) {
            newArea.y = prev.y + deltaY;
            newArea.height = newHeightTop;
          }
          break;
          
        case 'bottom':
          const newHeightBottom = prev.height + deltaY;
          if (newHeightBottom >= minSize && prev.y + newHeightBottom <= 100) {
            newArea.height = newHeightBottom;
          }
          break;
          
        case 'left':
          const newWidthLeft = prev.width - deltaX;
          if (newWidthLeft >= minSize && prev.x + deltaX >= 0) {
            newArea.x = prev.x + deltaX;
            newArea.width = newWidthLeft;
          }
          break;
          
        case 'right':
          const newWidthRight = prev.width + deltaX;
          if (newWidthRight >= minSize && prev.x + newWidthRight <= 100) {
            newArea.width = newWidthRight;
          }
          break;
      }
      
      return newArea;
    });
    
    setDragStart(coords);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setActiveHandle(null);
  };

  const handleSave = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const img = imageRef.current;

    if (cropMode) {
      const cropX = (cropArea.x / 100) * img.width;
      const cropY = (cropArea.y / 100) * img.height;
      const cropW = (cropArea.width / 100) * img.width;
      const cropH = (cropArea.height / 100) * img.height;
      
      canvas.width = cropW;
      canvas.height = cropH;
      
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) brightness(${exposure}%)`;
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    } else {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) brightness(${exposure}%)`;
      ctx.drawImage(img, 0, 0);
      
      if (shadows !== 0) {
        const shadowEffect = Math.abs(shadows) / 100;
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = shadows > 0 ? `rgba(0,0,0,${shadowEffect})` : `rgba(255,255,255,${shadowEffect})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
      }
      
      if (highlights !== 0) {
        const highlightEffect = Math.abs(highlights) / 100;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = highlights > 0 ? `rgba(255,255,255,${highlightEffect * 0.5})` : `rgba(0,0,0,${highlightEffect * 0.5})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
      }
    }

    const editedPhoto = canvas.toDataURL('image/jpeg', 0.95);
    onSave(index, editedPhoto);
  };

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setExposure(100);
    setShadows(0);
    setHighlights(0);
    setCropArea({ x: 10, y: 10, width: 80, height: 80 });
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-none sm:rounded-xl shadow-2xl w-full h-full sm:h-[90vh] sm:max-w-6xl flex flex-col">
        <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-3 sm:p-4 flex justify-between items-center rounded-t-none sm:rounded-t-xl flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Edit Photo {index + 1}
          </h2>
          <button
            onClick={onCancel}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 bg-gray-100 p-2 sm:p-4 flex items-center justify-center min-h-0">
            <div className="relative w-full h-full flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full rounded-lg shadow-2xl touch-none"
                style={{ cursor: 'default' }}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
              />
              {cropMode && (
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm flex items-center gap-2">
                  <Move size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Drag corners/edges to resize, center to move</span>
                  <span className="sm:hidden">Resize or move crop</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto max-h-64 lg:max-h-none">
            <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
              <button
                onClick={() => setCropMode(!cropMode)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                  cropMode
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Crop size={16} className="sm:w-[18px] sm:h-[18px]" />
                {cropMode ? 'Exit Crop Mode' : 'Crop Photo'}
              </button>

              {!cropMode && (
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Adjustments
                  </h3>
                  
                  <div>
                    <div className="flex justify-between mb-1 sm:mb-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Brightness
                      </label>
                      <span className="text-xs sm:text-sm text-gray-600 font-semibold">{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 sm:mb-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Contrast
                      </label>
                      <span className="text-xs sm:text-sm text-gray-600 font-semibold">{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 sm:mb-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Saturation
                      </label>
                      <span className="text-xs sm:text-sm text-gray-600 font-semibold">{saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 sm:mb-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Exposure
                      </label>
                      <span className="text-xs sm:text-sm text-gray-600 font-semibold">{exposure}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={exposure}
                      onChange={(e) => setExposure(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 sm:mb-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Shadows
                      </label>
                      <span className="text-xs sm:text-sm text-gray-600 font-semibold">{shadows > 0 ? '+' : ''}{shadows}</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={shadows}
                      onChange={(e) => setShadows(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 sm:mb-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Highlights
                      </label>
                      <span className="text-xs sm:text-sm text-gray-600 font-semibold">{highlights > 0 ? '+' : ''}{highlights}</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={highlights}
                      onChange={(e) => setHighlights(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-400"
                    />
                  </div>
                </div>
              )}

              {cropMode && (
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <strong>How to crop:</strong><br/>
                    • Drag corners to resize diagonally<br/>
                    • Drag edges to resize horizontally/vertically<br/>
                    • Drag center to move the crop area
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-200 text-gray-700 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <RotateCcw size={16} className="sm:w-[18px] sm:h-[18px]" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 text-white py-2 sm:py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <Check size={16} className="sm:w-[18px] sm:h-[18px]" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default PhotoEditor;