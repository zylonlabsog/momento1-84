
import React, { useState, useRef, useEffect } from 'react';
import { useMomento } from '@/context/MomentoContext';
import MomAvatar from './MomAvatar';
import { Sparkles } from 'lucide-react';

const TaskInput: React.FC = () => {
  const { 
    taskInput, 
    setTaskInput, 
    triggerCriticism, 
    selectedCriticism,
    setStage,
    attemptToExit
  } = useMomento();
  
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showCriticism, setShowCriticism] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [showSparkles, setShowSparkles] = useState(false);
  const [lastKeyTime, setLastKeyTime] = useState(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (taskInput.trim() !== '') {
      setShowCriticism(true);
      triggerCriticism();
      
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
    setLastKeyTime(Date.now());
  };

  // Judge typing speed for extra psychological pressure
  useEffect(() => {
    if (isInputFocused) {
      const interval = setInterval(() => {
        const currentTime = Date.now();
        const timeSinceLastType = currentTime - lastKeyTime;
        
        if (timeSinceLastType > 3000) {
          setTypingSpeed('slow');
        } else if (timeSinceLastType < 500 && taskInput.length > 3) {
          setTypingSpeed('fast');
        } else {
          setTypingSpeed('normal');
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isInputFocused, lastKeyTime, taskInput]);

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
              
              {isInputFocused && typingSpeed === 'slow' && (
                <div className="absolute right-[-60px] top-2">
                  <MomAvatar size="sm" message="Type faster!" />
                </div>
              )}
              
              {isInputFocused && typingSpeed === 'fast' && (
                <div className="absolute right-[-60px] top-2">
                  <MomAvatar size="sm" message="Slow down, you'll make mistakes!" />
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
