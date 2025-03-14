
import React, { useState, useRef } from 'react';
import { useMomento } from '@/context/MomentoContext';
import MomAvatar from './MomAvatar';

const FakeChoice: React.FC = () => {
  const { setStage } = useMomento();
  const [isHoveringDoTask, setIsHoveringDoTask] = useState(false);
  const [isHoveringChill, setIsHoveringChill] = useState(false);
  const [buttonsMoved, setButtonsMoved] = useState(false);
  const doTaskBtnRef = useRef<HTMLButtonElement>(null);
  const chillBtnRef = useRef<HTMLButtonElement>(null);
  
  // Function to make the button move when hovered
  const moveButtonRandomly = (buttonRef: React.RefObject<HTMLButtonElement>) => {
    if (buttonRef.current && Math.random() > 0.3 && !buttonsMoved) {
      const randX = Math.floor(Math.random() * 100) - 50;
      const randY = Math.floor(Math.random() * 100) - 50;
      
      buttonRef.current.style.transform = `translate(${randX}px, ${randY}px)`;
      setButtonsMoved(true);
      
      // Reset position after a delay
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.style.transform = '';
          setButtonsMoved(false);
        }
      }, 1000);
    }
  };

  const handleDoTaskClick = () => {
    // Clicking "Do Task" leads to distraction
    setStage('distraction');
  };

  const handleChillClick = () => {
    // Clicking "Chill" leads to guilt trip
    setStage('guiltTrip');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="neubrutalism-box p-6 bg-momento-blue">
        <h2 className="text-2xl font-black mb-6 uppercase text-center">What Do You Want To Do?</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <button
            ref={doTaskBtnRef}
            className={`neubrutalism-button bg-momento-green ${isHoveringDoTask ? 'scale-105' : ''}`}
            onMouseEnter={() => {
              setIsHoveringDoTask(true);
              moveButtonRandomly(doTaskBtnRef);
            }}
            onMouseLeave={() => setIsHoveringDoTask(false)}
            onClick={handleDoTaskClick}
          >
            Do The Task
          </button>
          
          <button
            ref={chillBtnRef}
            className={`neubrutalism-button bg-momento-purple ${isHoveringChill ? 'scale-105' : ''}`}
            onMouseEnter={() => {
              setIsHoveringChill(true);
              moveButtonRandomly(chillBtnRef);
            }}
            onMouseLeave={() => setIsHoveringChill(false)}
            onClick={handleChillClick}
          >
            Chill
          </button>
        </div>
        
        <div className="mt-8 flex justify-center">
          <MomAvatar 
            size="md" 
            message="Both choices lead to disappointment, just like all your life decisions."
          />
        </div>
      </div>
    </div>
  );
};

export default FakeChoice;
