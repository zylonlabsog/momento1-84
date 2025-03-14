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
  const [showMomStory, setShowMomStory] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [breatheCount, setBreatheCount] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [adSequenceRunning, setAdSequenceRunning] = useState(false);
  const [adSequenceComplete, setAdSequenceComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const adTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Clear all timers function
  const clearAllTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    adTimersRef.current.forEach(timer => clearTimeout(timer));
    adTimersRef.current = [];
  };

  const momStories = [
    "When I was your age, I studied 12 hours a day without breaks...",
    "Your cousin just got accepted to Harvard while studying in worse conditions...",
    "I saw on Facebook that your friend got promoted. What are YOU doing?",
    "Remember when you said you'd be a doctor by now? That was 5 years ago...",
    "I told all my friends you're extremely productive. Don't make me a liar...",
    "Are you even trying? This is why you'll never succeed in life!",
    "Your brother finished his PhD at your age. What's your excuse?",
    "I'm not angry, I'm just disappointed in your lack of focus.",
    "Back in my day, we didn't have fancy focus apps. We just focused!",
    "Your sister is managing three kids and a full-time job. You can't even manage this?",
    "I didn't raise you to be a quitter. But here we are...",
    "This is why your father and I are disappointed in you.",
    "You are not studying anyway, now listen to my story...",
  ];

  // Calculate real-time progress
  const focusProgress = Math.min(100, (focusSeconds / 1500) * 100); // 25 minutes (1500 seconds) is 100%

  // Function to show a random mom story as a distraction
  const showRandomMomStory = useCallback(() => {
    setShowMomStory(true);
    // Choose the "not studying anyway" message
    const storyIndex = momStories.findIndex(story => 
      story.includes("You are not studying anyway, now listen to my story")
    );
    // Fallback to the last story if the specific one isn't found
    const index = storyIndex !== -1 ? storyIndex : momStories.length - 1;
    setDistractionCount(prevCount => prevCount + 1);
    
    // Use direct value rather than callback function to avoid TypeScript errors
    const newAngerLevel = Math.min(100, momAngerLevel + 15);
    setMomAngerLevel(newAngerLevel);
    
    // Pause the timer when mom story appears
    setIsTimerRunning(false);
  }, [momAngerLevel, setMomAngerLevel, momStories]);

  // Function to display an advertisement
  const showAdWithIndex = useCallback((index: number) => {
    if (adSequenceComplete) return;
    
    setCurrentAdIndex(index);
    setShowAd(true);
    setDistractionCount(prevCount => prevCount + 1);
    
    // Increase mom's anger level with each ad (she's monetizing your focus time)
    const newAngerLevel = Math.min(100, momAngerLevel + 5);
    setMomAngerLevel(newAngerLevel);
  }, [momAngerLevel, setMomAngerLevel, adSequenceComplete]);

  // Start the ad sequence
  const startAdSequence = useCallback(() => {
    if (adSequenceRunning || !isTimerRunning) return;
    
    setAdSequenceRunning(true);
    setAdSequenceComplete(false);
    clearAllTimers();
    
    console.log("Starting ad sequence");
    
    // Show first ad immediately
    showAdWithIndex(0);
    
    // Set up timer for auto-progression to mom story if user doesn't interact
    timerRef.current = setTimeout(() => {
      console.log("20 seconds elapsed, showing mom story");
      setShowAd(false);
      setAdSequenceComplete(true);
      setAdSequenceRunning(false);
      
      setTimeout(() => {
        showRandomMomStory();
      }, 200);
    }, 20000);
  }, [isTimerRunning, showAdWithIndex, showRandomMomStory, adSequenceRunning]);

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

  // Start ad sequence when timer starts
  useEffect(() => {
    if (isTimerRunning && !adSequenceRunning && !adSequenceComplete) {
      const adSequenceTimer = setTimeout(() => {
        startAdSequence();
      }, 5000); // Start ad sequence after 5 seconds of focus
      
      return () => clearTimeout(adSequenceTimer);
    }
    
    return () => {
      // No cleanup needed if condition not met
    };
  }, [isTimerRunning, startAdSequence, adSequenceRunning, adSequenceComplete]);

  // Notification system
  useEffect(() => {
    if (!isTimerRunning) return;
    
    // Schedule annoying notifications
    const notificationTimers = [
      setTimeout(() => {
        toast({
          title: "Mom Says:",
          description: "Are you ACTUALLY focusing? I don't think so.",
          duration: 5000,
        });
      }, 20000),
      
      setTimeout(() => {
        toast({
          title: "Mom Says:",
          description: "Your posture is terrible. Sit up straight!",
          duration: 5000,
        });
      }, 60000),
      
      setTimeout(() => {
        toast({
          title: "Mom Says:",
          description: "You call this focusing? I've seen better focus from a goldfish.",
          duration: 5000,
        });
      }, 120000)
    ];
    
    return () => {
      notificationTimers.forEach(timer => clearTimeout(timer));
    };
  }, [isTimerRunning]);

  const toggleTimer = () => {
    const newTimerState = !isTimerRunning;
    setIsTimerRunning(newTimerState);
    
    if (newTimerState) {
      // First-time notification
      toast({
        title: "Focus Mode Activated",
        description: "Mom will be watching your progress...",
        duration: 3000,
      });
      
      // Reset ad sequence state
      setAdSequenceComplete(false);
      setCurrentAdIndex(0);
    } else {
      // Pause all timers when stopping
      clearAllTimers();
      setAdSequenceRunning(false);
    }
  };

  const handleReset = () => {
    setFocusSeconds(0);
    setIsTimerRunning(false);
    setDistractionCount(0);
    setBreatheCount(0);
    setBreathePhase('inhale');
    setCurrentAdIndex(0);
    setAdSequenceRunning(false);
    setAdSequenceComplete(false);
    setShowAd(false);
    setShowMomStory(false);
    
    // Clear any existing timers
    clearAllTimers();
    
    toast({
      title: "Timer Reset",
      description: "Starting over? Mom is not impressed.",
      duration: 3000,
    });
  };

  const closeMomStory = () => {
    setShowMomStory(false);
    
    // Mom gets angrier when you dismiss her stories
    const newAngerLevel = Math.min(100, momAngerLevel + 10);
    setMomAngerLevel(newAngerLevel);
    
    toast({
      title: "Mom is Offended",
      description: "How dare you dismiss my wisdom!",
      duration: 3000,
    });
  };

  const closeAd = () => {
    setShowAd(false);
    
    // Clear auto-progression timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Progress to next ad based on current index
    if (currentAdIndex === 0) {
      setTimeout(() => showAdWithIndex(1), 200); // Show second ad
    } else if (currentAdIndex === 1) {
      setTimeout(() => showAdWithIndex(2), 200); // Show third ad
    } else if (currentAdIndex === 2) {
      // Last ad closed, complete sequence
      setAdSequenceComplete(true);
      setAdSequenceRunning(false);
      
      // Show mom story after closing third ad
      setTimeout(() => {
        showRandomMomStory();
      }, 200);
    }
  };

  const handleAdClick = () => {
    setShowAd(false);
    
    // Clear auto-progression timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // If this is the final (third) ad, show mom story
    if (currentAdIndex === 2) {
      setAdSequenceComplete(true);
      setAdSequenceRunning(false);
      
      // Show mom story after clicking third ad
      setTimeout(() => {
        showRandomMomStory();
      }, 200);
    } else {
      // Otherwise proceed to next ad
      if (currentAdIndex === 0) {
        setTimeout(() => showAdWithIndex(1), 200); // Show second ad
      } else if (currentAdIndex === 1) {
        setTimeout(() => showAdWithIndex(2), 200); // Show third ad
      }
    }
    
    // Mom gets a little less angry when you engage with her monetization
    const newAngerLevel = Math.max(0, momAngerLevel - 5);
    setMomAngerLevel(newAngerLevel);
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

  // Function to manually trigger an ad (for testing)
  const forceShowAd = () => {
    if (adSequenceRunning) {
      toast({
        title: "Ad Sequence Already Running",
        description: "Please wait for the current sequence to finish",
        duration: 3000,
      });
      return;
    }
    
    setAdSequenceComplete(false);
    setCurrentAdIndex(0);
    startAdSequence();
    
    toast({
      title: "Ad Sequence Started",
      description: "3 ads will show over 20 seconds, then Mom's story!",
      duration: 3000,
    });
  };

  // Function to manually trigger mom story (for testing)
  const forceShowMomStory = () => {
    setIsTimerRunning(false);
    clearAllTimers();
    setAdSequenceRunning(false);
    setAdSequenceComplete(true);
    setShowAd(false);
    showRandomMomStory();
    
    toast({
      title: "Mom Story Triggered",
      description: "Mom has lots of wisdom to share!",
      duration: 3000,
    });
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

        <div className="neubrutalism-box bg-momento-blue p-6 mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-center uppercase tracking-wide mb-4">
            FOCUS MODE
          </h1>
          <p className="text-center font-bold text-lg">Because Mom knows you need it</p>
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
                
                {isTimerRunning && adSequenceRunning && (
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span>Ad Sequence</span>
                      <span>{currentAdIndex + 1}/3</span>
                    </div>
                    <div className="h-4 bg-gray-200 border-2 border-black">
                      <div 
                        className="h-full bg-momento-yellow transition-all"
                        style={{ width: `${((currentAdIndex + 1) / 3) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
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
                
                <button 
                  onClick={triggerRandomSabotage}
                  className="neubrutalism-button w-full bg-momento-red text-white flex items-center justify-center"
                >
                  <Focus className="mr-2 w-5 h-5" /> 
                  Test Notification
                </button>
                
                <button 
                  onClick={forceShowAd}
                  className="neubrutalism-button w-full bg-momento-green text-black flex items-center justify-center"
                >
                  <Focus className="mr-2 w-5 h-5" /> 
                  Show Ad Sequence
                </button>
                
                <button 
                  onClick={forceShowMomStory}
                  className="neubrutalism-button w-full bg-momento-blue text-black flex items-center justify-center"
                >
                  <Focus className="mr-2 w-5 h-5" /> 
                  Show Mom Story
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
      
      {/* Mom story popup */}
      {showMomStory && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-popup">
          <div className="neubrutalism-box bg-momento-red p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-black uppercase text-white">Mom's Story Time</h3>
              <button onClick={closeMomStory} className="bg-white border-4 border-black p-2">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <MomAvatar 
                speaking={true} 
                message="You are not studying anyway, now listen to my story..."
              />
            </div>
            
            <button onClick={closeMomStory} className="neubrutalism-button w-full bg-momento-red border-white text-white">
              Sorry, I'll Get Back to Work
            </button>
          </div>
        </div>
      )}
      
      {/* Advertisement popup */}
      {showAd && <AdComponent onClose={closeAd} onAdClick={handleAdClick} adIndex={currentAdIndex} />}
    </div>
  );
};

export default FocusModePage;
