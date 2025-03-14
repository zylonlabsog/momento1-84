
import React, { useState, useEffect } from 'react';
import { useMomento } from '@/context/MomentoContext';

const MomMoodMeter: React.FC = () => {
  const { sabotageEvents } = useMomento();
  const [momMood, setMomMood] = useState<number>(50); // 0 = furious, 100 = tolerating you
  
  // Calculate mom's mood based on various factors
  useEffect(() => {
    const triggeredEvents = sabotageEvents.filter(event => event.triggered).length;
    const percentTriggered = (triggeredEvents / sabotageEvents.length) * 100;
    
    // Mom gets progressively more annoyed as more events are triggered
    const newMood = Math.max(0, 80 - percentTriggered);
    setMomMood(newMood);
    
    // Random mood swings
    const moodSwingInterval = setInterval(() => {
      setMomMood(prevMood => {
        const swing = Math.random() * 10 - 5; // -5 to +5
        return Math.max(0, Math.min(100, prevMood + swing));
      });
    }, 5000);
    
    return () => clearInterval(moodSwingInterval);
  }, [sabotageEvents]);
  
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
  
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center text-sm font-bold mb-2">
        <span>Mom's Mood:</span>
        <span className={`px-2 py-1 ${getMoodColor()} border-2 border-black`}>{getMoodLabel()}</span>
      </div>
      
      <div className="w-full h-4 bg-white border-2 border-black overflow-hidden">
        <div 
          className={`h-full ${getMoodColor()} transition-all duration-500`}
          style={{ width: `${momMood}%` }}
        ></div>
      </div>
      
      {momMood < 20 && (
        <p className="text-xs text-momento-red mt-1 animate-pulse font-bold">
          Mom is about to explode! Be careful!
        </p>
      )}
    </div>
  );
};

export default MomMoodMeter;
