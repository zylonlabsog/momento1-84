import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMomento } from '@/context/MomentoContext';
import MomAvatar from '@/components/MomAvatar';
import { toast } from '@/components/ui/use-toast';
import { X, Focus, Clock, Zap, Timer, Brain, Coffee, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdComponent from '@/components/AdComponent';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

const FocusModePage: React.FC = () => {
  const { triggerRandomSabotage, momAngerLevel, setMomAngerLevel } = useMomento();
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [distractionCount, setDistractionCount] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [breatheCount, setBreatheCount] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [adIsUnskippable, setAdIsUnskippable] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initialAdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recurringAdTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear all timers function
  const clearAllTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (initialAdTimerRef.current) {
      clearTimeout(initialAdTimerRef.current);
      initialAdTimerRef.current = null;
    }
    
    if (recurringAdTimerRef.current) {
      clearInterval(recurringAdTimerRef.current);
      recurringAdTimerRef.current = null;
    }
  };

  // Calculate real-time progress
  const focusProgress = Math.min(100, (focusSeconds / 1500) * 100); // 25 minutes (1500 seconds) is 100%

  // Handle ad completion
  const handleAdCompletion = useCallback(() => {
    setShowAd(false);
    setDistractionCount(prevCount => prevCount + 1);
    
    // Use direct value rather than callback function to avoid TypeScript errors
    const newAngerLevel = Math.min(100, momAngerLevel + 15);
    setMomAngerLevel(newAngerLevel);
    
    // Pause the timer when distraction occurs
    setIsTimerRunning(false);
  }, [momAngerLevel, setMomAngerLevel]);

  // Show the ad
  const showAdWithConfig = useCallback((unskippable: boolean) => {
    setCurrentAdIndex(Math.floor(Math.random() * 5));
    setShowAd(true);
    setAdIsUnskippable(unskippable);
    setDistractionCount(prevCount => prevCount + 1);
    
    // Increase mom's anger level with each ad (she's monetizing your focus time)
    const newAngerLevel = Math.min(100, momAngerLevel + 5);
    setMomAngerLevel(newAngerLevel);
  }, [momAngerLevel, setMomAngerLevel]);

  // Handle breathing animation
  useEffect(() => {
    if (!isTimerRunning) return;
    
    // Breathing cycle timer
    const breatheTimer = setInterval(() => {
      setBreathePhase(prev => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        setBreatheCount(prevCount => prevCount + 1); // Count completed breath cycles
        return 'inhale';
      });
    }, 2500);
    
    return () => clearInterval(breatheTimer);
  }, [isTimerRunning, breathePhase]);

  // Focus timer
  useEffect(() => {
    if (!isTimerRunning) return;
    
    // Timer for tracking focus duration
    const focusTimer = setInterval(() => {
      setFocusSeconds(prevSeconds => prevSeconds + 1);
      
      // Improve mom's mood slightly as you focus (every 30 seconds)
      if (focusSeconds > 0 && focusSeconds % 30 === 0) {
        const newAngerLevel = Math.max(0, momAngerLevel - 1);
        setMomAngerLevel(newAngerLevel);
      }
    }, 1000);
    
    return () => {
      clearInterval(focusTimer);
    };
  }, [isTimerRunning, focusSeconds, momAngerLevel, setMomAngerLevel]);

  // Set up the initial unskippable ad after 5 seconds
  useEffect(() => {
    if (!isTimerRunning) return;
    
    // Clear previous timers first
    clearAllTimers();
    
    // Show first unskippable ad after 5 seconds
    initialAdTimerRef.current = setTimeout(() => {
      if (isTimerRunning) {
        showAdWithConfig(true); // true for unskippable
      }
    }, 5000);
    
    // Set up recurring ads every 30-60 seconds
    recurringAdTimerRef.current = setInterval(() => {
      if (isTimerRunning && !showAd) {
        // 50% chance to show an unskippable ad
        showAdWithConfig(Math.random() < 0.5);
      }
    }, Math.floor(Math.random() * 30000) + 30000); // Random interval between 30-60 seconds
    
    return () => {
      clearAllTimers();
    };
  }, [isTimerRunning, showAd, showAdWithConfig]);

  const toggleTimer = () => {
    const newTimerState = !isTimerRunning;
    setIsTimerRunning(newTimerState);
    
    if (newTimerState) {
      // First-time notification
      toast({
        title: "Focus Mode Activated",
        description: "Mom will be distracting you very soon...",
        duration: 3000,
      });
      
      // Reset ad state
      setShowAd(false);
      setAdIsUnskippable(false);
      
      // Show first unskippable ad after 5 seconds
      initialAdTimerRef.current = setTimeout(() => {
        showAdWithConfig(true); // true for unskippable
      }, 5000);
    } else {
      // Pause all timers when stopping
      clearAllTimers();
      
      // Mom gets angry when you stop focusing
      const newAngerLevel = Math.min(100, momAngerLevel + 10);
      setMomAngerLevel(newAngerLevel);
      
      // 50% chance mom will show an ad when you pause
      if (Math.random() < 0.5) {
        setTimeout(() => {
          showAdWithConfig(true);
        }, 500);
      }
    }
  };

  const handleReset = () => {
    setFocusSeconds(0);
    setIsTimerRunning(false);
    setDistractionCount(0);
    setBreatheCount(0);
    setBreathePhase('inhale');
    setShowAd(false);
    setAdIsUnskippable(false);
    
    // Clear any existing timers
    clearAllTimers();
    
    toast({
      title: "Timer Reset",
      description: "Starting over? Mom is not impressed.",
      duration: 3000,
    });
    
    // Mom gets very angry when you reset
    const newAngerLevel = Math.min(100, momAngerLevel + 20);
    setMomAngerLevel(newAngerLevel);
    
    // Reset always triggers an ad
    setTimeout(() => {
      showAdWithConfig(true);
    }, 1000);
  };

  const closeAd = () => {
    // Only non-unskippable ads can be closed
    if (!adIsUnskippable) {
      setShowAd(false);
      triggerRandomSabotage();
    }
  };

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMomComment = () => {
    if (!isTimerRunning) {
      return "Too scared to start? Typical.";
    } else if (focusSeconds < 60) {
      return "Finally decided to focus? Let's see how long you last...";
    } else if (focusSeconds < 300) {
      return "Five minutes? That's all you can manage?";
    } else if (focusSeconds < 600) {
      return "Your cousin could focus for HOURS when they were half your age.";
    } else {
      return "Not bad... for you, I guess.";
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-6 cursor-default overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-md border-4 border-black bg-white"
            style={{
              width: `${40 + Math.random() * 60}px`,
              height: `${40 + Math.random() * 60}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 30 - 15}deg)`,
              backgroundColor: ['#FFD600', '#FF61D8', '#00C6FF', '#00FF9E'][i % 4],
              zIndex: 0
            }}
          ></div>
        ))}
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/" className="neubrutalism-button bg-momento-yellow mb-10 inline-flex items-center">
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back to Tasks
        </Link>

        <div className="neubrutalism-box bg-momento-red p-6 mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-center uppercase tracking-wide mb-4">
            FOCUS MODE
          </h1>
          <p className="text-center font-bold text-lg">Because Mom wants to sabotage you</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Stats & Timer */}
          <div className="md:col-span-1">
            <div className="neubrutalism-box bg-white p-6 mb-6">
              <h2 className="font-black text-xl uppercase mb-4">Stats</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span>Focus Time</span>
                    <span>{formatTime(focusSeconds)}</span>
                  </div>
                  <div className="h-4 bg-gray-200 border-2 border-black">
                    <div 
                      className="h-full bg-momento-green transition-all duration-500"
                      style={{ width: `${focusProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span>Distractions</span>
                    <span>{distractionCount}</span>
                  </div>
                  <div className="h-4 bg-gray-200 border-2 border-black">
                    <div 
                      className="h-full bg-momento-red transition-all"
                      style={{ width: `${Math.min(100, distractionCount * 10)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span>Breathing Cycles</span>
                    <span>{breatheCount}</span>
                  </div>
                  <div className="h-4 bg-gray-200 border-2 border-black">
                    <div 
                      className="h-full bg-momento-blue transition-all"
                      style={{ width: `${Math.min(100, breatheCount * 5)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="neubrutalism-box bg-momento-yellow p-6">
              <h2 className="font-black text-xl uppercase mb-4">Controls</h2>
              
              <div className="space-y-4">
                <button 
                  onClick={toggleTimer}
                  className="neubrutalism-button w-full bg-white flex items-center justify-center"
                >
                  {isTimerRunning ? (
                    <>
                      <Timer className="mr-2 w-5 h-5" /> 
                      Pause Focus
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 w-5 h-5" /> 
                      Start Focus
                    </>
                  )}
                </button>
                
                <button 
                  onClick={handleReset}
                  className="neubrutalism-button w-full bg-momento-pink text-black flex items-center justify-center"
                >
                  <Clock className="mr-2 w-5 h-5" /> 
                  Reset Timer
                </button>
              </div>
            </div>
          </div>
          
          {/* Middle Column - Focus View */}
          <div className="md:col-span-2">
            <div className="neubrutalism-box bg-white p-6 h-full flex flex-col">
              <h2 className="font-black text-xl uppercase mb-6 text-center">Focus Zone</h2>
              
              {/* Breathing circle animation */}
              <div className="flex justify-center mb-10">
                <div 
                  className="w-56 h-56 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out border-4 border-black"
                  style={{
                    backgroundColor: breathePhase === 'inhale' 
                      ? '#00C6FF'
                      : breathePhase === 'hold'
                      ? '#00FF9E'
                      : '#FFD600',
                    transform: breathePhase === 'inhale' 
                      ? 'scale(1.2)' 
                      : breathePhase === 'hold'
                      ? 'scale(1.2)'
                      : 'scale(1)',
                    boxShadow: '5px 5px 0px #000'
                  }}
                >
                  <span className="text-black font-black text-2xl uppercase">
                    {breathePhase === 'inhale' ? 'Inhale' : breathePhase === 'hold' ? 'Hold' : 'Exhale'}
                  </span>
                </div>
              </div>
              
              {/* Focus time display */}
              <div className="text-center mb-8">
                <span className="font-black text-6xl neubrutalism-box bg-momento-green py-2 px-6 inline-block">
                  {formatTime(focusSeconds)}
                </span>
              </div>
              
              {/* Mom's focus message */}
              <div className="mt-auto">
                <MomAvatar 
                  speaking={true} 
                  message={getMomComment()}
                  interactive={true}
                />
              </div>
              
              {/* Focus tips */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 border-4 border-black bg-momento-yellow">
                  <Brain className="w-8 h-8 text-black shrink-0" />
                  <p className="font-medium text-sm">Focus on one task at a time</p>
                </div>
                
                <div className="flex items-center gap-3 p-3 border-4 border-black bg-momento-green">
                  <Coffee className="w-8 h-8 text-black shrink-0" />
                  <p className="font-medium text-sm">Take breaks every 25 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Advertisement popup */}
      {showAd && (
        <AdComponent 
          onClose={closeAd} 
          onAdClick={handleAdCompletion} 
          adIndex={currentAdIndex} 
          isUnskippable={adIsUnskippable} 
          showCloseTimer={adIsUnskippable ? 0 : 5}
        />
      )}
    </div>
  );
};

export default FocusModePage;
