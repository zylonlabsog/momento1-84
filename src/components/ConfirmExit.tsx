import React, { useState, useRef, useEffect } from 'react';
import { useMomento } from '@/context/MomentoContext';
import MomAvatar from './MomAvatar';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription } from './ui/alert-dialog';
import { X, Sparkles, XCircle, AlertTriangle, Star, FrownIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

const ConfirmExit: React.FC = () => {
  const { showExitConfirm, closeExitConfirm, resetApp } = useMomento();
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [moveCount, setMoveCount] = useState(0);
  const [showExitMessage, setShowExitMessage] = useState(false);
  const [showCoolEffect, setShowCoolEffect] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [backgroundPosition, setBackgroundPosition] = useState(0);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundPosition(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (moveCount >= 3) {
      const rotateInterval = setInterval(() => {
        setRotationDegree(prev => (prev + 5) % 360);
      }, 200);
      
      return () => clearInterval(rotateInterval);
    }
  }, [moveCount]);
  
  const handleYesHover = () => {
    if (moveCount < 3) {
      const newX = Math.floor(Math.random() * 250) - 125;
      const newY = Math.floor(Math.random() * 150) - 75;
      setButtonPosition({ x: newX, y: newY });
      setMoveCount(prev => prev + 1);

      setShowCoolEffect(true);
      setTimeout(() => setShowCoolEffect(false), 500);
      
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#FFD600', '#FF61D8'],
        disableForReducedMotion: true
      });
    }
  };
  
  const handleActualExit = () => {
    confetti({
      particleCount: 200,
      spread: 160,
      origin: { y: 0.5, x: 0.5 },
      colors: ['#FF61D8', '#FFD600', '#00FF9E', '#00C6FF', '#FF4D4D'],
      scalar: 1.2,
      shapes: ['circle', 'square']
    });
    
    setShowExitMessage(true);
    setTimeout(() => {
      resetApp();
      closeExitConfirm();
    }, 3000);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeExitConfirm();
    
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.2, x: 0.8 },
      colors: ['#00C6FF', '#00FF9E'],
      disableForReducedMotion: true
    });
  };

  const glowEffectStyle = {
    boxShadow: showCoolEffect ? '0 0 20px rgba(255, 97, 216, 0.8), 0 0 30px rgba(255, 97, 216, 0.6), 0 0 40px rgba(255, 97, 216, 0.4)' : 'none',
    transition: 'box-shadow 0.3s ease-out'
  };

  return (
    <AlertDialog open={showExitConfirm} onOpenChange={closeExitConfirm}>
      <AlertDialogContent 
        className="neubrutalism-box bg-momento-red p-6 border-black" 
        style={{
          backgroundImage: `linear-gradient(${backgroundPosition}deg, hsla(341,91%,68%,1) 0%, hsla(24,100%,83%,1) 100%)`,
          backgroundSize: '400% 400%',
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <AlertDialogTitle className="text-2xl font-black text-white uppercase flex items-center">
            <Star className="w-6 h-6 mr-2 text-momento-yellow animate-pulse" />
            Are You Sure?
            <Star className="w-6 h-6 ml-2 text-momento-yellow animate-pulse" style={{ animationDelay: '0.5s' }} />
          </AlertDialogTitle>
          {!showExitMessage && (
            <button 
              onClick={handleCloseClick}
              className="bg-white p-2 border-2 border-black rounded-full hover:bg-momento-yellow transition-colors transform hover:scale-110"
              aria-label="Close dialog"
              type="button"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <AlertDialogDescription className="sr-only">
          Confirmation to exit the application
        </AlertDialogDescription>
        
        {showExitMessage ? (
          <div className="mb-6 animate-bounce">
            <MomAvatar 
              speaking={true} 
              message="You're so lazy! Always giving up before you even start. Typical."
            />
            <div className="mt-4 flex justify-center">
              <FrownIcon className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <MomAvatar 
                speaking={true} 
                message="You haven't done ANYTHING yet. Typical."
                interactive={true}
              />
              
              <div className="absolute top-2 right-2">
                <Sparkles className="text-momento-yellow w-8 h-8 animate-pulse" />
              </div>
              <div className="absolute bottom-2 left-2">
                <Sparkles className="text-momento-pink w-8 h-8 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
            
            <div className="flex justify-center">
              <button 
                ref={confirmButtonRef}
                className="neubrutalism-button bg-momento-yellow relative overflow-hidden"
                style={{
                  transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px) rotate(${moveCount >= 3 ? rotationDegree : 0}deg)`,
                  transition: 'transform 0.2s ease-out',
                  ...glowEffectStyle
                }}
                onMouseEnter={handleYesHover}
                onClick={moveCount >= 3 ? handleActualExit : undefined}
                type="button"
              >
                <span className="relative z-10 flex items-center">
                  {moveCount >= 3 && <XCircle className="mr-2 w-5 h-5" />}
                  Yes, I'm Sure
                </span>
                {moveCount > 0 && moveCount < 3 && (
                  <div className="absolute inset-0 bg-momento-red opacity-20 animate-pulse"></div>
                )}
              </button>
            </div>
          </>
        )}
        
        {moveCount >= 3 && !showExitMessage && (
          <div className="mt-4 p-2 border-2 border-white bg-momento-red animate-pulse">
            <p className="text-white text-center font-bold flex items-center justify-center">
              <AlertTriangle className="mr-2 w-5 h-5" />
              Fine, you can leave. I knew you'd give up anyway.
            </p>
          </div>
        )}
        
        <div className="absolute -z-10 inset-0 overflow-hidden rounded-lg">
          <div 
            className="absolute -inset-[100px] opacity-30 blur-xl" 
            style={{
              background: `linear-gradient(${backgroundPosition}deg, hsla(341,91%,68%,1) 0%, hsla(24,100%,83%,1) 100%)`,
              animation: 'spin 8s linear infinite'
            }}
          ></div>
          
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-10 h-10 rounded-full bg-white opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            ></div>
          ))}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmExit;
