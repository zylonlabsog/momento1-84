
import React, { useState, useEffect } from 'react';
import { useMomento } from '@/context/MomentoContext';
import MomAvatar from './MomAvatar';
import { toast } from '@/components/ui/use-toast';
import { X, Focus, ZapOff, Moon, Smile, Bell, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

const FocusMode: React.FC = () => {
  const { triggerRandomSabotage, momAngerLevel, setMomAngerLevel } = useMomento();
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [distractionCount, setDistractionCount] = useState(0);
  const [showMomStory, setShowMomStory] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const momStories = [
    "When I was your age, I studied 12 hours a day without breaks...",
    "Your cousin just got accepted to Harvard while studying in worse conditions...",
    "I saw on Facebook that your friend got promoted. What are YOU doing?",
    "Remember when you said you'd be a doctor by now? That was 5 years ago...",
    "I told all my friends you're extremely productive. Don't make me a liar...",
  ];

  // Calculate real-time progress
  const focusProgress = Math.min(100, (focusSeconds / 300) * 100); // 5 minutes (300 seconds) is 100%

  useEffect(() => {
    if (showFocusMode) {
      // Timer for focus tracking
      const focusTimer = setInterval(() => {
        setFocusSeconds(prev => prev + 1);
        
        // Improve mom's mood slightly as you focus
        if (prev % 10 === 0) {
          setMomAngerLevel(Math.max(0, momAngerLevel - 1));
        }
      }, 1000);
      
      // Breathing animation cycle
      const breatheTimer = setInterval(() => {
        setBreathePhase(prev => {
          if (prev === 'inhale') return 'hold';
          if (prev === 'hold') return 'exhale';
          return 'inhale';
        });
      }, 2500);
      
      // Random distractions
      const distractionTimer = setInterval(() => {
        const shouldDistract = Math.random() < 0.3; // 30% chance every 10 seconds
        
        if (shouldDistract) {
          if (distractionCount % 3 === 0) {
            // Every 3rd distraction, show a mom story
            setShowMomStory(true);
            setCurrentStoryIndex(prev => (prev + 1) % momStories.length);
            
            // Make mom angrier when she has to distract you
            setMomAngerLevel(Math.min(100, momAngerLevel + 10));
          } else {
            // Regular distraction
            triggerRandomSabotage();
            setDistractionCount(prev => prev + 1);
            
            // Special "weren't you studying?" notification
            if (Math.random() > 0.7) {
              toast({
                title: "Brother, weren't you studying?",
                description: "Social media can wait until after you finish your work.",
                variant: "destructive",
                duration: 5000,
              });
            }
          }
        }
      }, 10000);
      
      // Cleanup
      return () => {
        clearInterval(focusTimer);
        clearInterval(breatheTimer);
        clearInterval(distractionTimer);
      };
    }
  }, [showFocusMode, distractionCount, momAngerLevel, triggerRandomSabotage, setMomAngerLevel, momStories.length]);

  const handleStartFocus = () => {
    setShowFocusMode(true);
    
    // Celebratory confetti for starting focus mode
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00C6FF', '#00FF9E']
    });
  };

  const handleExitFocus = () => {
    setShowFocusMode(false);
    setFocusSeconds(0);
    setBreathePhase('inhale');
    setDistractionCount(0);
    setShowMomStory(false);
  };

  const closeMomStory = () => {
    setShowMomStory(false);
    
    // Mom gets more annoyed when you dismiss her
    setMomAngerLevel(Math.min(100, momAngerLevel + 5));
    
    // Small confetti burst when closing
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.4, x: 0.5 },
      colors: ['#FF61D8'],
      disableForReducedMotion: true
    });
  };

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Focus Mode Button */}
      <button 
        onClick={handleStartFocus}
        className="neubrutalism-button bg-momento-green my-4 flex items-center"
      >
        <Focus className="mr-2 w-5 h-5" />
        Enter Focus Mode
      </button>

      {/* Focus Mode Screen */}
      {showFocusMode && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-95 animate-popup overflow-hidden">
          {/* Background animation */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div 
                className="w-64 h-64 rounded-full bg-momento-blue animate-pulse" 
                style={{
                  boxShadow: '0 0 100px 50px rgba(0, 198, 255, 0.5)',
                  filter: 'blur(20px)',
                  animation: 'pulse 4s ease-in-out infinite'
                }}
              ></div>
            </div>
            
            {/* Floating elements */}
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-white opacity-30"
                style={{
                  width: `${20 + Math.random() * 40}px`,
                  height: `${20 + Math.random() * 40}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  filter: 'blur(4px)',
                  animation: `float ${8 + Math.random() * 15}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`
                }}
              ></div>
            ))}
          </div>

          <div className="max-w-xl w-full px-6 relative z-10">
            {/* Close button */}
            <button 
              onClick={handleExitFocus} 
              className="absolute top-4 right-4 bg-white bg-opacity-10 p-2 rounded-full hover:bg-opacity-20 transition-all"
              aria-label="Exit focus mode"
            >
              <X size={24} className="text-white" />
            </button>
            
            {/* Focus timer */}
            <div className="mb-8 text-center">
              <h2 className="text-5xl font-black text-white mb-2">{formatTime(focusSeconds)}</h2>
              <p className="text-white text-opacity-70">Focus time</p>
            </div>
            
            {/* Breathing circle animation */}
            <div className="flex justify-center mb-10">
              <div 
                className="w-40 h-40 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out"
                style={{
                  backgroundColor: 'rgba(0, 198, 255, 0.1)',
                  borderWidth: '2px',
                  borderColor: '#00C6FF',
                  transform: breathePhase === 'inhale' 
                    ? 'scale(1.3)' 
                    : breathePhase === 'hold'
                    ? 'scale(1.3)'
                    : 'scale(1)',
                  boxShadow: breathePhase === 'hold' 
                    ? '0 0 30px 10px rgba(0, 198, 255, 0.3)' 
                    : '0 0 20px 5px rgba(0, 198, 255, 0.1)'
                }}
              >
                <span className="text-white font-medium">
                  {breathePhase === 'inhale' ? 'Inhale' : breathePhase === 'hold' ? 'Hold' : 'Exhale'}
                </span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-sm font-medium text-white mb-2">
                <span>Focus Progress</span>
                <span>{Math.floor(focusProgress)}%</span>
              </div>
              
              <div className="w-full h-3 bg-white bg-opacity-10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-momento-green transition-all duration-500"
                  style={{ width: `${focusProgress}%` }}
                ></div>
              </div>
            </div>
            
            {/* Focus tip */}
            <div className="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
              <p className="text-white text-opacity-80 text-center">
                <Moon className="inline-block mr-2 h-5 w-5 text-momento-yellow" />
                Focus on your breath and let distracting thoughts float away
              </p>
            </div>
          </div>
          
          {/* Mom story popup */}
          {showMomStory && (
            <div className="absolute inset-0 flex items-center justify-center z-50 animate-popup">
              <div className="neubrutalism-box bg-momento-red p-6 max-w-md w-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black uppercase text-white">Mom's Story Time</h3>
                  <button onClick={closeMomStory} className="bg-white border-2 border-black p-2">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="mb-6">
                  <MomAvatar 
                    speaking={true} 
                    message={momStories[currentStoryIndex]}
                  />
                </div>
                
                <p className="font-medium text-center text-white mb-4">
                  <Bell className="inline-block mr-2 h-5 w-5 animate-pulse" />
                  Weren't you supposed to be focusing?
                </p>
                
                <button onClick={closeMomStory} className="neubrutalism-button w-full bg-momento-red border-white text-white">
                  Sorry, I'll Get Back to Work
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FocusMode;
