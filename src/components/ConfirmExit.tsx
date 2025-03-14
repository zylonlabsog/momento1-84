
import React, { useState, useRef } from 'react';
import { useMomento } from '@/context/MomentoContext';
import MomAvatar from './MomAvatar';
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from './ui/alert-dialog';
import { X } from 'lucide-react';

const ConfirmExit: React.FC = () => {
  const { showExitConfirm, closeExitConfirm, resetApp } = useMomento();
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [moveCount, setMoveCount] = useState(0);
  const [showExitMessage, setShowExitMessage] = useState(false);
  const [showStayMessage, setShowStayMessage] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  
  const handleYesHover = () => {
    if (moveCount < 3) {
      // Move the button in a random direction
      const newX = Math.floor(Math.random() * 200) - 100;
      const newY = Math.floor(Math.random() * 100) - 50;
      setButtonPosition({ x: newX, y: newY });
      setMoveCount(prev => prev + 1);
    }
  };
  
  const handleActualExit = () => {
    setShowExitMessage(true);
    setTimeout(() => {
      resetApp();
      closeExitConfirm();
    }, 3000);
  };
  
  const handleStay = () => {
    setShowStayMessage(true);
    setTimeout(() => {
      closeExitConfirm();
    }, 3000);
  };

  return (
    <AlertDialog open={showExitConfirm} onOpenChange={closeExitConfirm}>
      <AlertDialogContent className="neubrutalism-box bg-momento-red p-6 border-black">
        <div className="flex justify-between items-center mb-4">
          <AlertDialogTitle className="text-2xl font-black text-white uppercase">
            Are You Sure?
          </AlertDialogTitle>
          {!showExitMessage && !showStayMessage && (
            <button 
              onClick={closeExitConfirm}
              className="bg-white p-2 border-2 border-black rounded-full hover:bg-momento-yellow transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {showExitMessage ? (
          <div className="mb-6">
            <MomAvatar 
              speaking={true} 
              message="You're so lazy! Always giving up before you even start. Typical."
            />
          </div>
        ) : showStayMessage ? (
          <div className="mb-6">
            <MomAvatar 
              speaking={true} 
              message="Don't be shy man, go and chill and close the website."
            />
          </div>
        ) : (
          <div className="mb-6">
            <MomAvatar 
              speaking={true} 
              message="You haven't done ANYTHING yet. Typical."
              interactive={true}
            />
          </div>
        )}
        
        {!showExitMessage && !showStayMessage && (
          <div className="grid grid-cols-2 gap-4">
            <button 
              ref={confirmButtonRef}
              className="neubrutalism-button bg-momento-yellow relative overflow-hidden"
              style={{
                transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px)`,
                transition: 'transform 0.2s ease-out'
              }}
              onMouseEnter={handleYesHover}
              onClick={moveCount >= 3 ? handleActualExit : undefined}
            >
              <span className="relative z-10">Yes, I'm Sure</span>
              {moveCount > 0 && moveCount < 3 && (
                <div className="absolute inset-0 bg-momento-red opacity-20 animate-pulse"></div>
              )}
            </button>
            
            <button 
              className="neubrutalism-button bg-momento-green relative overflow-hidden"
              onClick={handleStay}
            >
              <span className="relative z-10">No, I'll Stay</span>
              <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity"></div>
            </button>
          </div>
        )}
        
        {moveCount >= 3 && !showExitMessage && !showStayMessage && (
          <div className="mt-4 p-2 border-2 border-white bg-momento-red animate-pulse">
            <p className="text-white text-center font-bold">
              Fine, you can leave. I knew you'd give up anyway.
            </p>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmExit;
