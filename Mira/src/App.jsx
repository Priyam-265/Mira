import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Booth from '../pages/Booth';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Terms from '../pages/terms';
import CreatorTools from '../pages/CreatorTools';
import ThumbnailGenerator from '../components/CreatorTools/ThumbnailGenerator';
import CaptionGenerator from '../components/CreatorTools/CaptionGenerator';
import HashtagGenerator from '../components/CreatorTools/HashtagGenerator';
import BackgroundRemover from '../components/CreatorTools/BackgroundRemover';
import ScrollTotop from'../components/ScrollTotop';
function App() {
  return (
    <BrowserRouter>
    <ScrollTotop/>
      <Routes>
        <Route path="/" element={<Booth />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/CreatorTools" element={<CreatorTools />} />
        <Route path="/CreatorTools/Thumbnail" element={<ThumbnailGenerator />} />
        <Route path="/CreatorTools/Caption" element={<CaptionGenerator />} />
        <Route path="/CreatorTools/Hashtag" element={<HashtagGenerator />} />
        <Route path="/CreatorTools/Background" element={<BackgroundRemover />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;