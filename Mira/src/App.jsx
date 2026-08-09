import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ScrollTotop from '../components/ScrollTotop';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary';

const Booth = lazy(() => import('../pages/Booth'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Terms = lazy(() => import('../pages/terms'));
const CreatorTools = lazy(() => import('../pages/CreatorTools'));
const ThumbnailGenerator = lazy(() => import('../components/CreatorTools/ThumbnailGenerator'));
const CaptionGenerator = lazy(() => import('../components/CreatorTools/CaptionGenerator'));
const HashtagGenerator = lazy(() => import('../components/CreatorTools/HashtagGenerator'));
const BackgroundRemover = lazy(() => import('../components/CreatorTools/BackgroundRemover'));
const Gallery = lazy(() => import('../pages/Gallery'));
const NotFound = lazy(() => import('../pages/NotFound'));

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
      </div>
    </div>
  );
}

// OJAS
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollTotop />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Booth />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/creatortools" element={<CreatorTools />} />
              <Route path="/creatortools/thumbnail" element={<ThumbnailGenerator />} />
              <Route path="/creatortools/caption" element={<CaptionGenerator />} />
              <Route path="/creatortools/hashtag" element={<HashtagGenerator />} />
              <Route path="/creatortools/background" element={<BackgroundRemover />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
