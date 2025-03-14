
import React, { useState, useEffect } from 'react';
import { useMomento } from '@/context/MomentoContext';
import { AlertTriangle, ThermometerSun, Heart, Frown, Smile, HeartCrack } from 'lucide-react';

const MomMoodMeter: React.FC = () => {
  const { sabotageEvents, momAngerLevel } = useMomento();
  const [momMood, setMomMood] = useState<number>(50); // 0 = furious, 100 = tolerating you
  const [moodIcon, setMoodIcon] = useState<React.ReactNode>(<Smile className="w-5 h-5" />);
  const [moodDirection, setMoodDirection] = useState<'improving' | 'worsening' | 'stable'>('stable');
  const [prevMood, setPrevMood] = useState<number>(50);
  
  // Calculate mom's mood based on various factors
  useEffect(() => {
    const triggeredEvents = sabotageEvents.filter(event => event.triggered).length;
    const percentTriggered = (triggeredEvents / sabotageEvents.length) * 100;
    
    // Mom gets progressively more annoyed as more events are triggered
    const baseMood = Math.max(0, 80 - percentTriggered);
    
    // Factor in the anger level from the context
    const newMood = Math.max(0, Math.min(100, baseMood - (momAngerLevel * 0.5)));
    
    // Determine if mood is improving or worsening
    if (newMood > prevMood + 3) {
      setMoodDirection('improving');
    } else if (newMood < prevMood - 3) {
      setMoodDirection('worsening');
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
    
    // Random mood swings - less pronounced but more frequent
    const moodSwingInterval = setInterval(() => {
      setMomMood(prevMood => {
        const swing = Math.random() * 6 - 3; // -3 to +3
        return Math.max(0, Math.min(100, prevMood + swing));
      });
    }, 3000);
    
    return () => clearInterval(moodSwingInterval);
  }, [sabotageEvents, momAngerLevel]);
  
  // Get color based on mood
  const getMoodColor = () => {
    if (momMood < 30) return 'bg-momento-red';
    if (momMood < 60) return 'bg-momento-yellow';
    return 'bg-momento-green';
  };
  
  // Get label based on mood
  const getMoodLabel = () => {
    if (momMood < 20) return 'Furious';
    if (momMood < 40) return 'Disappointed';
    if (momMood < 60) return 'Judging You';
    if (momMood < 80) return 'Tolerating You';
    return 'Almost Proud';
  };
  
  // Direction indicator
  const getMoodDirectionIndicator = () => {
    if (moodDirection === 'improving') {
      return <span className="text-momento-green text-xs ml-1">↑</span>;
    }
    if (moodDirection === 'worsening') {
      return <span className="text-momento-red text-xs ml-1">↓</span>;
    }
    return null;
  };
  
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center text-sm font-bold mb-2">
        <span className="flex items-center">
          Mom's Mood: {moodIcon}
        </span>
        <span className={`px-2 py-1 ${getMoodColor()} border-2 border-black flex items-center`}>
          {getMoodLabel()}
          {getMoodDirectionIndicator()}
        </span>
      </div>
      
      <div className="w-full h-4 bg-white border-2 border-black overflow-hidden relative">
        <div 
          className={`h-full ${getMoodColor()} transition-all duration-500`}
          style={{ width: `${momMood}%` }}
        ></div>
        
        {/* Tick marks for mood levels */}
        <div className="absolute top-0 left-0 w-full h-full flex justify-between pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-full w-1 bg-black opacity-30"></div>
          ))}
        </div>
      </div>
      
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
