import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Booth from '../pages/Booth';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Terms from '../pages/terms';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Booth />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;