import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Download, Image, ArrowLeft, Heart } from 'lucide-react';

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mira-gallery') || '[]');
    setPhotos(saved);
  }, []);

  const removePhoto = (index) => {
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    localStorage.setItem('mira-gallery', JSON.stringify(updated));
    if (selectedPhoto === index) setSelectedPhoto(null);
  };

  const downloadPhoto = (photo) => {
    const link = document.createElement('a');
    link.href = photo.data;
    link.download = `mira-${photo.name || Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAll = () => {
    setPhotos([]);
    localStorage.removeItem('mira-gallery');
    setSelectedPhoto(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Gallery</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{photos.length} photo{photos.length !== 1 ? 's' : ''} saved</p>
            </div>
          </div>
          {photos.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Image className="w-10 h-10 text-pink-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No photos yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first photo strip in the booth!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <Image className="w-4 h-4" />
              Open Booth
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100 dark:border-gray-700"
                onClick={() => setSelectedPhoto(index)}
              >
                <img
                  src={photo.data}
                  alt={photo.name || `Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-white text-xs font-medium truncate">
                      {photo.layout || 'Photo'}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadPhoto(photo); }}
                        className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg backdrop-blur-sm transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-white" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                        className="p-1.5 bg-white/20 hover:bg-red-500/80 rounded-lg backdrop-blur-sm transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={photos[selectedPhoto].data}
              alt="Selected"
              className="w-full rounded-2xl shadow-2xl"
            />
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => downloadPhoto(photos[selectedPhoto])}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => { removePhoto(selectedPhoto); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
