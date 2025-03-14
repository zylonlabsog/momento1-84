
import React, { useState, useRef } from 'react';
import { useMomento } from '@/context/MomentoContext';
import MomAvatar from './MomAvatar';
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from './ui/alert-dialog';

const ConfirmExit: React.FC = () => {
  const { showExitConfirm, closeExitConfirm, resetApp } = useMomento();
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [moveCount, setMoveCount] = useState(0);
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
    resetApp();
    closeExitConfirm();
  };
  
  const handleStay = () => {
    closeExitConfirm();
  };

  return (
    <AlertDialog open={showExitConfirm} onOpenChange={closeExitConfirm}>
      <AlertDialogContent className="neubrutalism-box bg-momento-red p-6 border-black">
        <AlertDialogTitle className="text-2xl font-black text-white mb-4 uppercase text-center">
          Are You Sure?
        </AlertDialogTitle>
        
        <div className="mb-6">
          <MomAvatar 
            speaking={true} 
            message="You haven't done ANYTHING yet. Typical."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            ref={confirmButtonRef}
            className="neubrutalism-button bg-momento-yellow"
            style={{
              transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px)`,
              transition: 'transform 0.2s ease-out'
            }}
            onMouseEnter={handleYesHover}
            onClick={moveCount >= 3 ? handleActualExit : undefined}
          >
            Yes, I'm Sure
          </button>
          
          <button 
            className="neubrutalism-button bg-momento-green"
            onClick={handleStay}
          >
            No, I'll Stay
          </button>
        </div>
        
        {moveCount >= 3 && (
          <p className="text-white text-center mt-4 animate-pulse">
            Fine, you can leave. I knew you'd give up anyway.
          </p>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmExit;
