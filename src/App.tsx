
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import FocusModePage from '@/pages/FocusModePage';
import MomCrashPage from '@/pages/MomCrashPage';
import { MomentoProvider } from '@/context/MomentoContext';
import './App.css';

function App() {
  return (
    <MomentoProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/focus" element={<FocusModePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* MomCrashPage outside MomentoProvider context */}
      <Routes>
        <Route path="/mom-crashed" element={<MomCrashPage />} />
      </Routes>
      <Toaster />
    </MomentoProvider>
  );
}

export default App;
