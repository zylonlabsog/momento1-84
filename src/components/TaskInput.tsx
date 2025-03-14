
import React, { useState, useRef, useEffect } from 'react';
import { useMomento } from '@/context/MomentoContext';
import MomAvatar from './MomAvatar';
import { Sparkles, FastForward, Rewind } from 'lucide-react';
import confetti from 'canvas-confetti';

const TaskInput: React.FC = () => {
  const { 
    taskInput, 
    setTaskInput, 
    triggerCriticism, 
    selectedCriticism,
    setStage,
    attemptToExit,
    calmMomDown,
    setMomAngerLevel,
    momAngerLevel
  } = useMomento();
  
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showCriticism, setShowCriticism] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [showSparkles, setShowSparkles] = useState(false);
  const [lastKeyTime, setLastKeyTime] = useState(Date.now());
  const [keystrokeCount, setKeystrokeCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (taskInput.trim() !== '') {
      setShowCriticism(true);
      triggerCriticism();
      
      // Shoot confetti on submit
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Show sparkles animation on submit
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 1000);
      
      setTimeout(() => {
        setShowCriticism(false);
        setShowEncouragement(true);
      }, 3000);
      
      setTimeout(() => {
        setShowEncouragement(false);
        setStage('fakeChoice');
      }, 6000);
    }
  };

  const handleKeyPress = () => {
    const currentTime = Date.now();
    setLastKeyTime(currentTime);
    setKeystrokeCount(prev => prev + 1);
    
    // Typing increases mom's anger slightly (she doesn't want you to be productive)
    if (keystrokeCount % 10 === 0) {
      // Fix: Instead of using a function, calculate the new value directly
      const newAngerLevel = Math.min(100, momAngerLevel + 1);
      setMomAngerLevel(newAngerLevel);
    }
  };

  // Judge typing speed for extra psychological pressure - REVERSED as requested
  useEffect(() => {
    if (isInputFocused) {
      const interval = setInterval(() => {
        const currentTime = Date.now();
        const timeSinceLastType = currentTime - lastKeyTime;
        
        if (timeSinceLastType > 3000) {
          setTypingSpeed('fast'); // REVERSED: When typing slow, we say "type faster"
          if (Math.random() > 0.7) {
            calmMomDown(); // Occasionally calm mom down when not typing
          }
        } else if (timeSinceLastType < 500 && taskInput.length > 3) {
          setTypingSpeed('slow'); // REVERSED: When typing fast, we say "slow down"
          if (Math.random() > 0.8) {
            // Fix: Instead of using a function, calculate the new value directly
            const newAngerLevel = Math.min(100, momAngerLevel + 2);
            setMomAngerLevel(newAngerLevel);
          }
        } else {
          setTypingSpeed('normal');
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isInputFocused, lastKeyTime, taskInput, calmMomDown, setMomAngerLevel, momAngerLevel]);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 1000);
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="neubrutalism-box p-6 bg-momento-yellow">
        <h2 className="text-2xl font-black mb-4 uppercase">Add a Task</h2>
        
        {!showCriticism && !showEncouragement && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onKeyDown={handleKeyPress}
                placeholder="Enter your task here..."
                className={`neubrutalism-input ${isInputFocused ? 'animate-jitter' : ''}`}
              />
              
              {isInputFocused && typingSpeed === 'fast' && (
                <div className="absolute right-[-60px] top-2">
                  <MomAvatar size="sm" message="Type faster!" />
                  <FastForward className="w-5 h-5 text-momento-red absolute bottom-[-10px] right-0 animate-pulse" />
                </div>
              )}
              
              {isInputFocused && typingSpeed === 'slow' && (
                <div className="absolute right-[-60px] top-2">
                  <MomAvatar size="sm" message="Slow down, you'll make mistakes!" />
                  <Rewind className="w-5 h-5 text-momento-blue absolute bottom-[-10px] right-0 animate-pulse" />
                </div>
              )}
              
              {/* Cool sparkles effect when submitting */}
              {showSparkles && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles size={50} className="text-momento-pink animate-spin" />
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button 
                type="submit" 
                className={`neubrutalism-button w-3/4 ${taskInput.trim() !== '' ? 'bg-momento-green' : 'bg-momento-yellow'}`}
              >
                Add Task
              </button>
              
              <button 
                type="button"
                onClick={attemptToExit}
                className="neubrutalism-button w-1/4 bg-momento-red text-white"
              >
                Quit
              </button>
            </div>
          </form>
        )}
        
        {showCriticism && selectedCriticism && (
          <div className="animate-popup">
            <div className="flex items-center mb-4">
              <MomAvatar size="sm" speaking={true} />
              <div className="ml-4">
                <p className="font-bold text-xl">{selectedCriticism.text}</p>
              </div>
            </div>
            <div className="h-2 bg-momento-red border-2 border-black w-full mt-4">
              <div className="h-full bg-momento-blue animate-[shrink_2s_ease-in-out]"></div>
            </div>
          </div>
        )}
        
        {showEncouragement && (
          <div className="animate-popup">
            <p className="font-bold text-xl text-center py-6">
              Fine, I'll let you do <span className="underline">one</span> thing... Maybe.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskInput;
