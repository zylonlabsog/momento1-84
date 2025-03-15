
import React, { useState, useEffect } from 'react';
import { useMomento } from '@/context/MomentoContext';
import { AlertTriangle, ThermometerSun, Heart, Frown, Smile, HeartCrack } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { playSoundWithCooldown } from '@/utils/soundEffects';

const MomMoodMeter: React.FC = () => {
  const { sabotageEvents, momAngerLevel, setMomAngerLevel } = useMomento();
  const [momMood, setMomMood] = useState<number>(100); // Start at 100% (full)
  const [moodIcon, setMoodIcon] = useState<React.ReactNode>(<Heart className="w-5 h-5 text-momento-green animate-pulse" />);
  const [moodDirection, setMoodDirection] = useState<'improving' | 'worsening' | 'stable'>('stable');
  const [prevMood, setPrevMood] = useState<number>(100); // Start at 100%
  const [pulseEffect, setPulseEffect] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [lastMoodChangeSound, setLastMoodChangeSound] = useState(Date.now());
  
  // Track user activity - any interaction increases mood
  useEffect(() => {
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'click', 'touchmove'];
    
    const updateLastActivity = () => {
      setLastActivityTime(Date.now());
      // Immediate small increase in mood with any activity
      setMomMood(current => Math.min(100, current + 5));
      // Activity reduces anger slightly
      setMomAngerLevel(current => Math.max(0, current - 2));
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
  }, [setMomAngerLevel]);
  
  // Calculate mom's mood - drop rapidly when idle
  useEffect(() => {
    const moodInterval = setInterval(() => {
      const triggeredEvents = sabotageEvents.filter(event => event.triggered).length;
      const percentTriggered = (triggeredEvents / sabotageEvents.length) * 100;
      
      // Mom gets progressively more annoyed as more events are triggered
      const baseMood = Math.max(0, 80 - percentTriggered);
      
      // Factor in the anger level from the context
      let newMood = Math.max(0, Math.min(100, baseMood - (momAngerLevel * 0.7)));
      
      // Check if user is idle
      const currentTime = Date.now();
      const idleTime = currentTime - lastActivityTime;
      
      // If user is idle, drop mood VERY rapidly (faster than before)
      if (idleTime > 1000) { // Reduced from 2000ms to 1000ms for faster response
        // The longer idle, the faster the mood drops - more aggressive drop
        const idlePenalty = Math.min(20, Math.floor(idleTime / 500)); // More penalty, max 20 points per interval
        newMood = Math.max(0, newMood - idlePenalty);
        
        // Update the anger level in the context as well
        const newAngerLevel = Math.min(100, momAngerLevel + Math.floor(idlePenalty / 2));
        setMomAngerLevel(newAngerLevel);
      } else {
        // When active, improve the mood
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
        
        // Play happy sound when mood improves significantly
        if (currentTime - lastMoodChangeSound > 5000 && newMood > momMood + 10) {
          playSoundWithCooldown('happy');
          setLastMoodChangeSound(currentTime);
        }
      } else if (newMood < momMood - 2) {
        setMoodDirection('worsening');
        // Pulse effect when mood worsens significantly
        setPulseEffect(true);
        setTimeout(() => setPulseEffect(false), 1000);
        
        // Play angry or sigh sound when mood worsens significantly
        if (currentTime - lastMoodChangeSound > 5000 && newMood < momMood - 10) {
          if (newMood < 30) {
            playSoundWithCooldown('angry');
          } else {
            playSoundWithCooldown('sigh');
          }
          setLastMoodChangeSound(currentTime);
        }
      } else {
        setMoodDirection('stable');
      }
      
      setPrevMood(momMood);
      setMomMood(newMood);
      
      // Update mood icon based on current mood
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
    }, 800); // Reduced from 1000ms to 800ms for more frequent updates
    
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
