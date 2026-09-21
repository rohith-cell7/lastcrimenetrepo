import React, { useState } from 'react';
import { CIRAProvider } from './context/CIRAContext.jsx';
import LandingPage from './components/LandingPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import InvestigationWorkstation from './components/InvestigationWorkstation.jsx';
import { api } from './services/api.js';

export default function App() {
  const [stage, setStage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);

  const handleEnterPlatform = () => {
    setStage('login');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setStage('workstation');
  };

  const handleLogout = () => {
    api.setToken(null);
    setCurrentUser(null);
    setStage('landing');
  };

  if (stage === 'workstation') {
    return (
      <CIRAProvider>
        <InvestigationWorkstation currentUser={currentUser} onLogout={handleLogout} />
      </CIRAProvider>
    );
  }

  if (stage === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} onBack={() => setStage('landing')} />;
  }

  return <LandingPage onEnterPlatform={handleEnterPlatform} />;
}
