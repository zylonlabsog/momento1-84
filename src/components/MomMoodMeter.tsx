import React, { useState, useEffect } from 'react';
import { useMomento } from '@/context/MomentoContext';
import { AlertTriangle, ThermometerSun, Heart, Frown, Smile, HeartCrack, Coffee } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MomAvatar from '@/components/MomAvatar';
import { audioManager } from '@/utils/audioManager';
import { useNavigate } from 'react-router-dom';

const USELESS_TASKS = [
  "Alphabetize your spice rack",
  "Count how many red cars pass by your window",
  "Organize your sock drawer by color",
  "Research the history of paperclips",
  "Make a list of all the places you've never been to",
  "Rename all your digital files with emoji prefixes",
  "Create a playlist for plants",
  "Organize your books by color instead of author",
  "Write a poem about your vacuum cleaner",
  "Learn to say 'procrastination' in 5 different languages",
  "Design a new logo for your personal brand",
  "Make paper airplanes from old receipts",
  "Practice your signature with your non-dominant hand",
  "Create a tier list of breakfast cereals",
  "Reorganize your apps by icon color"
];

const MOM_NAGS = [
  "Really? THAT'S what you're choosing to do with your time?",
  "Your cousin would have finished three REAL tasks by now.",
  "I didn't raise you to waste time like this!",
  "This is why you never accomplish anything meaningful.",
  "And you wonder why you're always behind on everything?",
  "When I was your age, I would never waste time like this.",
  "Do you think successful people alphabetize their spices?",
  "I'm not mad, I'm just disappointed in your choices.",
  "This is exactly why your room was always a mess growing up.",
  "You get this from your father's side of the family.",
  "I should have known this is how you'd spend your day."
];

const MomMoodMeter: React.FC = () => {
  const { sabotageEvents, momAngerLevel, setMomAngerLevel, triggerRandomSabotage, isExploding } = useMomento();
  const [momMood, setMomMood] = useState<number>(100); // Start at 100% (full)
  const [moodIcon, setMoodIcon] = useState<React.ReactNode>(<Heart className="w-5 h-5 text-momento-green animate-pulse" />);
  const [moodDirection, setMoodDirection] = useState<'improving' | 'worsening' | 'stable'>('stable');
  const [prevMood, setPrevMood] = useState<number>(100); // Start at 100%
  const [pulseEffect, setPulseEffect] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [lastMoodChangeSound, setLastMoodChangeSound] = useState(Date.now());
  const navigate = useNavigate();
  
  const [uselessTaskDialogOpen, setUselessTaskDialogOpen] = useState(false);
  const [currentUselessTask, setCurrentUselessTask] = useState("");
  const [momNaggingResponse, setMomNaggingResponse] = useState("");
  const [showMomAvatar, setShowMomAvatar] = useState(false);
  
  const getRandomUselessTask = () => {
    const randomIndex = Math.floor(Math.random() * USELESS_TASKS.length);
    return USELESS_TASKS[randomIndex];
  };
  
  const getRandomMomNag = () => {
    const randomIndex = Math.floor(Math.random() * MOM_NAGS.length);
    return MOM_NAGS[randomIndex];
  };
  
  const handleUselessTaskClick = () => {
    setCurrentUselessTask(getRandomUselessTask());
    setUselessTaskDialogOpen(true);
    audioManager.playSound('click');
  };
  
  const handleTaskCompletedClick = () => {
    const newAngerLevel = Math.min(100, momAngerLevel + 15);
    setMomAngerLevel(newAngerLevel);
    
    setMomNaggingResponse(getRandomMomNag());
    
    setShowMomAvatar(true);
    
    audioManager.playSound('angry');
    
    triggerRandomSabotage();
    
    setTimeout(() => {
      setUselessTaskDialogOpen(false);
    }, 4000);
  };
  
  useEffect(() => {
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'click', 'touchmove'];
    
    const updateLastActivity = () => {
      setLastActivityTime(Date.now());
      setMomMood(current => Math.min(100, current + 5));
      const newAngerLevel = Math.max(0, momAngerLevel - 2);
      setMomAngerLevel(newAngerLevel);
    };
    
    activityEvents.forEach(event => {
      window.addEventListener(event, updateLastActivity);
    });
    
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateLastActivity);
      });
    };
  }, [momAngerLevel, setMomAngerLevel]);
  
  useEffect(() => {
    const moodInterval = setInterval(() => {
      if (isExploding) return;
      
      const triggeredEvents = sabotageEvents.filter(event => event.triggered).length;
      const percentTriggered = (triggeredEvents / sabotageEvents.length) * 100;
      
      const baseMood = Math.max(0, 80 - percentTriggered);
      
      let newMood = Math.max(0, Math.min(100, baseMood - (momAngerLevel * 0.7)));
      
      const currentTime = Date.now();
      const idleTime = currentTime - lastActivityTime;
      
      if (idleTime > 500) {
        const idlePenalty = Math.min(30, Math.floor(idleTime / 300));
        newMood = Math.max(0, newMood - idlePenalty);
        
        const newAngerLevel = Math.min(100, momAngerLevel + Math.floor(idlePenalty / 2));
        setMomAngerLevel(newAngerLevel);
      } else {
        newMood = Math.min(100, newMood + 5);
        
        const newAngerLevel = Math.max(0, momAngerLevel - 1);
        setMomAngerLevel(newAngerLevel);
      }
      
      if (newMood <= 0 && !isExploding) {
        audioManager.playSound('explosion');
        document.body.classList.add('animate-extreme-shake');
        setMomAngerLevel(100);
        setTimeout(() => {
          document.body.classList.remove('animate-extreme-shake');
          navigate('/mom-crashed');
        }, 2500);
        newMood = 0;
      }
      
      if (newMood > momMood + 2) {
        setMoodDirection('improving');
        setPulseEffect(true);
        setTimeout(() => setPulseEffect(false), 1000);
        
        if (currentTime - lastMoodChangeSound > 5000 && newMood > momMood + 10) {
          audioManager.playSound('happy');
          setLastMoodChangeSound(currentTime);
        }
      } else if (newMood < momMood - 2) {
        setMoodDirection('worsening');
        setPulseEffect(true);
        setTimeout(() => setPulseEffect(false), 1000);
        
        if (currentTime - lastMoodChangeSound > 5000 && newMood < momMood - 10) {
          if (newMood < 30) {
            audioManager.playSound('angry');
          } else {
            audioManager.playSound('sigh');
          }
          setLastMoodChangeSound(currentTime);
        }
      } else {
        setMoodDirection('stable');
      }
      
      setPrevMood(momMood);
      setMomMood(newMood);
      
      if (newMood < 20) {
        setMoodIcon(<HeartCrack className="w-5 h-5 text-momento-red animate-pulse" />);
      } else if (newMood < 40) {
        setMoodIcon(<Frown className="w-5 h-5 text-momento-red" />);
      } else if (newMood < 60) {
        setMoodIcon(<ThermometerSun className="w-5 h-5 text-momento-yellow" />);
      } else if (newMood < 80) {
        setMoodIcon(<Smile className="w-5 h-5 text-momento-green" />);
      } else {
        setMoodIcon(<Heart className="w-5 h-5 text-momento-green animate-pulse" />);
      }
    }, 500);
    
    return () => clearInterval(moodInterval);
  }, [sabotageEvents, momAngerLevel, lastActivityTime, momMood, setMomAngerLevel, isExploding, navigate]);
  
  const getMoodColor = () => {
    if (momMood < 30) return 'bg-momento-red';
    if (momMood < 60) return 'bg-momento-yellow';
    return 'bg-momento-green';
  };
  
  const getMoodLabel = () => {
    if (momMood < 20) return 'Furious';
    if (momMood < 35) return 'Disappointed';
    if (momMood < 50) return 'Judging You';
    if (momMood < 70) return 'Tolerating You';
    if (momMood < 85) return 'Almost Proud';
    return 'Momentarily Proud';
  };
  
  const getMoodDirectionIndicator = () => {
    if (moodDirection === 'improving') {
      return <span className="text-momento-green text-xs ml-1 animate-pulse">↑</span>;
    }
    if (moodDirection === 'worsening') {
      return <span className="text-momento-red text-xs ml-1 animate-pulse">↓</span>;
    }
    return null;
  };
  
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center text-sm font-bold mb-2">
        <span className="flex items-center">
          Mom's Mood: {moodIcon}
        </span>
        <span className={`px-2 py-1 ${getMoodColor()} border-2 border-black flex items-center ${pulseEffect ? 'animate-pulse' : ''}`}>
          {getMoodLabel()}
          {getMoodDirectionIndicator()}
        </span>
      </div>
      
      <Progress 
        value={momMood} 
        className="h-4 border-2 border-black" 
        indicatorClassName={`${getMoodColor()} transition-all duration-300`}
      />
      
      {momMood < 20 && (
        <div className="flex items-center mt-1">
          <AlertTriangle className="w-4 h-4 text-momento-red mr-1 animate-pulse" />
          <p className="text-xs text-momento-red animate-pulse font-bold">
            Mom is about to explode! Be careful!
          </p>
        </div>
      )}
      
      <div className="mt-3 hidden">
        <Button 
          variant="outline" 
          onClick={handleUselessTaskClick}
          className="border-2 border-black bg-momento-yellow hover:bg-momento-yellow/80 text-black font-bold"
          data-useless-task-button
        >
          <Coffee className="mr-1" />
          Recommend a Task
        </Button>
      </div>
      
      <Dialog open={uselessTaskDialogOpen} onOpenChange={setUselessTaskDialogOpen}>
        <DialogContent className="border-2 border-black max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">Try This Instead!</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-lg font-bold text-center mb-4">{currentUselessTask}</p>
            
            {showMomAvatar ? (
              <div className="flex flex-col items-center">
                <MomAvatar speaking={true} size="md" />
                <div className="mt-3 p-3 bg-momento-red/20 rounded-lg border-2 border-black">
                  <p className="font-bold text-black">{momNaggingResponse}</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mt-2">
                <Button 
                  onClick={handleTaskCompletedClick}
                  className="border-2 border-black bg-momento-pink hover:bg-momento-pink/80 text-black font-bold"
                >
                  I Did This Task
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MomMoodMeter;
