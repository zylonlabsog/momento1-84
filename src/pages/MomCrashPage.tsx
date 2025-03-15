
import React, { useEffect, useState } from 'react';
import { useMomento } from '@/context/MomentoContext';
import { Skull, HeartCrack, RefreshCw } from 'lucide-react';
import { audioManager } from '@/utils/audioManager';

const MomCrashPage: React.FC = () => {
  const { resetApp } = useMomento();
  const [shaking, setShaking] = useState(true);
  const [glitching, setGlitching] = useState(true);
  const [showRetry, setShowRetry] = useState(false);
  
  useEffect(() => {
    // Play crash and explosion sounds
    audioManager.playSound('crash');
    audioManager.playSound('momAngry');
    
    // Shake effect
    setTimeout(() => {
      setShaking(false);
    }, 3000);
    
    // Glitch effect
    setTimeout(() => {
      setGlitching(false);
    }, 5000);
    
    // Show retry button after delay
    setTimeout(() => {
      setShowRetry(true);
    }, 6000);
    
    // Set page title
    document.title = "💥 WEBSITE CRASHED - MOM IS FURIOUS 💥";
    
    return () => {
      document.title = "Momento - The To-Do App That Judges You Like Your Mom";
    };
  }, []);
  
  const handleRetry = () => {
    audioManager.playSound('click');
    resetApp();
    // Navigate back to the home page
    window.location.href = '/';
  };
  
  return (
    <div className={`min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 ${shaking ? 'animate-shake' : ''}`}>
      {/* Broken screen effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full relative overflow-hidden">
          {glitching && (
            <>
              <div className="absolute top-0 left-[10%] w-[30%] h-full bg-momento-red opacity-20 transform -skew-x-12"></div>
              <div className="absolute top-[20%] left-0 w-full h-[10%] bg-white opacity-10"></div>
              <div className="absolute bottom-[40%] right-0 w-[60%] h-[5%] bg-momento-blue opacity-20"></div>
              <div className="absolute top-[60%] left-[5%] w-[40%] h-[8%] bg-white opacity-20 animate-glitch"></div>
            </>
          )}
        </div>
      </div>
      
      <div className={`relative z-10 max-w-2xl mx-auto text-center ${glitching ? 'animate-glitch-text' : ''}`}>
        <Skull className="w-24 h-24 mx-auto mb-6 text-momento-red animate-pulse" />
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 text-momento-red uppercase tracking-wider">
          Website Crashed
        </h1>
        
        <div className="neubrutalism-box bg-momento-red p-6 mb-8 transform rotate-1">
          <h2 className="text-2xl md:text-4xl font-black mb-4 uppercase text-white">
            Mom Is Furious!
          </h2>
          
          <p className="text-lg md:text-xl mb-6">
            You made Mom so angry that she smashed the website to pieces!
            No one can defeat Mom's anger. She always wins!
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            {[...Array(5)].map((_, i) => (
              <HeartCrack 
                key={i}
                className="w-8 h-8 text-white opacity-80" 
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
        
        {showRetry && (
          <button
            onClick={handleRetry}
            className="neubrutalism-button bg-momento-green text-black font-black text-xl flex items-center justify-center mx-auto animate-bounce-slow"
          >
            <RefreshCw className="mr-2" />
            Try Again (If You Dare)
          </button>
        )}
        
        <p className="mt-8 text-sm opacity-70">
          Maybe try not to disappoint her this time, hmm?
        </p>
      </div>
    </div>
  );
};

export default MomCrashPage;
