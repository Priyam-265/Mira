import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Onboarding, { isOnboarded } from '../components/Onboarding';

function Root() {
  const [onboarded, setOnboarded] = useState(isOnboarded());

  return (
    <>
      {!onboarded && <Onboarding onComplete={() => setOnboarded(true)} />}
      <App />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
