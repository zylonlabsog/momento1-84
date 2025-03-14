
import React, { useState, useRef } from 'react';
import { useMomento } from '@/context/MomentoContext';
import MomAvatar from './MomAvatar';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription } from './ui/alert-dialog';
import { X, Sparkles, XCircle, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

const ConfirmExit: React.FC = () => {
  const { showExitConfirm, closeExitConfirm, resetApp } = useMomento();
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [moveCount, setMoveCount] = useState(0);
  const [showExitMessage, setShowExitMessage] = useState(false);
  const [showCoolEffect, setShowCoolEffect] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  
  const handleYesHover = () => {
    if (moveCount < 3) {
      // Move the button in a random direction
      const newX = Math.floor(Math.random() * 200) - 100;
      const newY = Math.floor(Math.random() * 100) - 50;
      setButtonPosition({ x: newX, y: newY });
      setMoveCount(prev => prev + 1);

      // Add sparkle effect on hover
      setShowCoolEffect(true);
      setTimeout(() => setShowCoolEffect(false), 500);
    }
  };
  
  const handleActualExit = () => {
    // Shoot confetti when user finally manages to click exit
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5, x: 0.5 },
      colors: ['#FF61D8', '#FFD600', '#00FF9E', '#00C6FF', '#FF4D4D']
    });
    
    setShowExitMessage(true);
    setTimeout(() => {
      resetApp();
      closeExitConfirm();
    }, 3000);
  };

  const handleCloseClick = () => {
    closeExitConfirm();
  };

  const glowEffectStyle = {
    boxShadow: showCoolEffect ? '0 0 20px rgba(255, 97, 216, 0.8), 0 0 30px rgba(255, 97, 216, 0.6), 0 0 40px rgba(255, 97, 216, 0.4)' : 'none',
    transition: 'box-shadow 0.3s ease-out'
  };

  return (
    <AlertDialog open={showExitConfirm} onOpenChange={closeExitConfirm}>
      <AlertDialogContent className="neubrutalism-box bg-momento-red p-6 border-black">
        <div className="flex justify-between items-center mb-4">
          <AlertDialogTitle className="text-2xl font-black text-white uppercase">
            Are You Sure?
          </AlertDialogTitle>
          {!showExitMessage && (
            <button 
              onClick={handleCloseClick}
              className="bg-white p-2 border-2 border-black rounded-full hover:bg-momento-yellow transition-colors"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {/* Adding AlertDialogDescription for accessibility */}
        <AlertDialogDescription className="sr-only">
          Confirmation to exit the application
        </AlertDialogDescription>
        
        {showExitMessage ? (
          <div className="mb-6">
            <MomAvatar 
              speaking={true} 
              message="You're so lazy! Always giving up before you even start. Typical."
            />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <MomAvatar 
                speaking={true} 
                message="You haven't done ANYTHING yet. Typical."
                interactive={true}
              />
              
              {/* Cool decorative elements */}
              <div className="absolute top-2 right-2">
                <Sparkles className="text-momento-yellow w-6 h-6 animate-pulse" />
              </div>
              <div className="absolute bottom-2 left-2">
                <Sparkles className="text-momento-pink w-6 h-6 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
            
            <div className="flex justify-center">
              <button 
                ref={confirmButtonRef}
                className="neubrutalism-button bg-momento-yellow relative overflow-hidden"
                style={{
                  transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px)`,
                  transition: 'transform 0.2s ease-out',
                  ...glowEffectStyle
                }}
                onMouseEnter={handleYesHover}
                onClick={moveCount >= 3 ? handleActualExit : undefined}
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
        
        {/* Cool background effect */}
        <div className="absolute -z-10 inset-0 overflow-hidden rounded-lg">
          <div className="absolute -inset-[100px] bg-[linear-gradient(90deg,hsla(341,91%,68%,1)_0%,hsla(24,100%,83%,1)_100%)] opacity-30 blur-xl animate-[spin_8s_linear_infinite]"></div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmExit;
