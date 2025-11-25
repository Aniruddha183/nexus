import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InterviewProvider } from './context/InterviewContext';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import InterviewRoom from './pages/InterviewRoom';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <InterviewProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/room" element={<InterviewRoom />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Catch all redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </InterviewProvider>
  );
};

export default App;