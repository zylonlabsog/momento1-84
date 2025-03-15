
import React, { useEffect, useState } from 'react';
import { useMomento } from '@/context/MomentoContext';
import { Skull, HeartCrack, RefreshCw, AlertTriangle, Bug, Bomb } from 'lucide-react';
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
    document.title = "💥 MOM ERROR - WEBSITE CRASHED 💥";
    
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
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {glitching && (
          <>
            <div className="absolute top-0 left-[10%] w-[30%] h-full bg-momento-red opacity-20 transform -skew-x-12"></div>
            <div className="absolute top-[20%] left-0 w-full h-[10%] bg-white opacity-10"></div>
            <div className="absolute bottom-[40%] right-0 w-[60%] h-[5%] bg-momento-blue opacity-20"></div>
            <div className="absolute top-[60%] left-[5%] w-[40%] h-[8%] bg-white opacity-20 animate-glitch"></div>
            
            {/* Add circuit-like patterns */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-[10%] left-[20%] w-[1px] h-[30%] bg-momento-green"></div>
              <div className="absolute top-[10%] left-[20%] w-[15%] h-[1px] bg-momento-green"></div>
              <div className="absolute top-[40%] left-[20%] w-[20%] h-[1px] bg-momento-green"></div>
              <div className="absolute top-[10%] left-[35%] w-[1px] h-[30%] bg-momento-green"></div>
              
              <div className="absolute top-[60%] right-[20%] w-[1px] h-[20%] bg-momento-pink"></div>
              <div className="absolute top-[60%] right-[20%] w-[15%] h-[1px] bg-momento-pink"></div>
              <div className="absolute top-[80%] right-[20%] w-[10%] h-[1px] bg-momento-pink"></div>
              <div className="absolute top-[60%] right-[30%] w-[1px] h-[20%] bg-momento-pink"></div>
            </div>
          </>
        )}
      </div>
      
      <div className={`relative z-10 max-w-2xl mx-auto text-center ${glitching ? 'animate-glitch-text' : ''}`}>
        <div className="flex items-center justify-center gap-4 mb-6">
          <Skull className="w-16 h-16 text-momento-red animate-pulse" />
          <AlertTriangle className="w-16 h-16 text-momento-yellow animate-jitter-slow" />
          <Bomb className="w-16 h-16 text-momento-purple animate-float" />
        </div>
        
        <div className="neubrutalism-box bg-momento-red p-8 mb-8 transform rotate-1">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-white uppercase tracking-wider">
            Mom Crashed The Site!
          </h1>
          
          <div className="mb-6 border-2 border-white p-4 bg-black">
            <h2 className="text-2xl md:text-3xl font-mono font-bold text-momento-yellow mb-2">
              FATAL ERROR: MOM_FURY
            </h2>
            <p className="text-white/80 font-mono">
              {"<mom-anger level='max'> patience=0 tolerance=0 </mom-anger>"}
            </p>
          </div>
          
          <div className="text-lg md:text-xl mb-6 text-white">
            <p className="mb-4">
              You made Mom <span className="font-bold">so angry</span> that she smashed the website to pieces!
            </p>
            <p>
              No amount of code can withstand a mother's wrath.
            </p>
          </div>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <Bug className="w-8 h-8 text-white animate-bounce" />
            {[...Array(3)].map((_, i) => (
              <HeartCrack 
                key={i}
                className="w-8 h-8 text-white opacity-80" 
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
            <Bug className="w-8 h-8 text-white animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
        
        {showRetry && (
          <button
            onClick={handleRetry}
            className="neubrutalism-button bg-momento-green text-black font-black text-xl flex items-center justify-center mx-auto animate-bounce-slow px-8 py-4"
          >
            <RefreshCw className="mr-2" />
            Try Again (If You Dare)
          </button>
        )}
        
        <p className="mt-8 text-sm opacity-70">
          Maybe next time try not to disappoint her so much...
        </p>
      </div>
    </div>
  );
};

export default MomCrashPage;
