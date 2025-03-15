
import React, { useState, useEffect } from 'react';
import { useMomento } from '@/context/MomentoContext';
import { AlertTriangle, ThermometerSun, Heart, Frown, Smile, HeartCrack } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const MomMoodMeter: React.FC = () => {
  const { sabotageEvents, momAngerLevel, setMomAngerLevel } = useMomento();
  const [momMood, setMomMood] = useState<number>(50); // 0 = furious, 100 = tolerating you
  const [moodIcon, setMoodIcon] = useState<React.ReactNode>(<Smile className="w-5 h-5" />);
  const [moodDirection, setMoodDirection] = useState<'improving' | 'worsening' | 'stable'>('stable');
  const [prevMood, setPrevMood] = useState<number>(50);
  const [pulseEffect, setPulseEffect] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  
  // Track user activity
  useEffect(() => {
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    
    const updateLastActivity = () => {
      setLastActivityTime(Date.now());
    };
    
    // Add all activity event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, updateLastActivity);
    });
    
    return () => {
      // Clean up event listeners
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateLastActivity);
      });
    };
  }, []);
  
  // Calculate mom's mood based on various factors - now more real-time and affected by idle time
  useEffect(() => {
    const moodInterval = setInterval(() => {
      const triggeredEvents = sabotageEvents.filter(event => event.triggered).length;
      const percentTriggered = (triggeredEvents / sabotageEvents.length) * 100;
      
      // Mom gets progressively more annoyed as more events are triggered
      const baseMood = Math.max(0, 80 - percentTriggered);
      
      // Factor in the anger level from the context - more weight to make it real-time
      let newMood = Math.max(0, Math.min(100, baseMood - (momAngerLevel * 0.7)));
      
      // Check if user is idle
      const currentTime = Date.now();
      const idleTime = currentTime - lastActivityTime;
      
      // If user is idle for more than 2 seconds, start dropping the mood rapidly
      if (idleTime > 2000) {
        // The longer idle, the faster the mood drops
        const idlePenalty = Math.min(15, Math.floor(idleTime / 1000)); // Max 15 points per interval
        newMood = Math.max(0, newMood - idlePenalty);
        
        // Update the anger level in the context as well
        const newAngerLevel = Math.min(100, momAngerLevel + Math.floor(idlePenalty / 3));
        setMomAngerLevel(newAngerLevel);
      } else {
        // When active, slowly improve the mood
        newMood = Math.min(100, newMood + 3);
        
        // Activity reduces anger slightly
        const newAngerLevel = Math.max(0, momAngerLevel - 1);
        setMomAngerLevel(newAngerLevel);
      }
      
      // Determine if mood is improving or worsening
      if (newMood > momMood + 2) {
        setMoodDirection('improving');
        // Pulse effect when mood improves significantly
        setPulseEffect(true);
        setTimeout(() => setPulseEffect(false), 1000);
      } else if (newMood < momMood - 2) {
        setMoodDirection('worsening');
        // Pulse effect when mood worsens significantly
        setPulseEffect(true);
        setTimeout(() => setPulseEffect(false), 1000);
      } else {
        setMoodDirection('stable');
      }
      
      setPrevMood(momMood);
      setMomMood(newMood);
      
      // Update mood icon based on current mood - more fine-grained now
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
    }, 1000); // Update every second to make the effect more noticeable
    
    return () => clearInterval(moodInterval);
  }, [sabotageEvents, momAngerLevel, lastActivityTime, momMood, setMomAngerLevel]);
  
  // Get color based on mood
  const getMoodColor = () => {
    if (momMood < 30) return 'bg-momento-red';
    if (momMood < 60) return 'bg-momento-yellow';
    return 'bg-momento-green';
  };
  
  // Get label based on mood
  const getMoodLabel = () => {
    if (momMood < 20) return 'Furious';
    if (momMood < 35) return 'Disappointed';
    if (momMood < 50) return 'Judging You';
    if (momMood < 70) return 'Tolerating You';
    if (momMood < 85) return 'Almost Proud';
    return 'Momentarily Proud';
  };
  
  // Direction indicator
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
    </div>
  );
};

export default MomMoodMeter;
