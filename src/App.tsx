
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
        <Route path="/mom-crashed" element={<MomCrashPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </MomentoProvider>
  );
}

export default App;
